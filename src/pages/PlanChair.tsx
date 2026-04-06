import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonLabel,
  IonIcon,
  IonText,
} from "@ionic/react";
import { CircleDot, DoorOpen, Toilet, TriangleAlert, MoveDown, User } from "lucide-react";
import { supabase } from "../supabase/supabase";
import { Trip } from "../types/trip";
import moment from "moment";
import "./css/PlanChair.css";

// --- Types ---
type SeatStatus = "available" | "booked" | "unavailable" | "selected";

interface Seat {
  id: string;
  number: string;
  row: number;
  col: number;
  status: SeatStatus;
  floor: number;
  price?: number;
}

interface BusLayout {
  id: string;
  name: string;
  rows: (string | null)[][];
}

const SPECIAL_CELLS = ['DRIVER', 'DOOR1', 'DOOR2', 'TOILET', 'EMERGENCY', 'STAIRS'];

const statusClasses: Record<SeatStatus, string> = {
  available: "seat-available",
  booked: "seat-booked",
  unavailable: "seat-unavailable",
  selected: "seat-selected",
};

const specialCellLabels: Record<string, string> = {
  DRIVER: "พขร.",
  DOOR1: "ประตู 1",
  DOOR2: "ประตู 2",
  TOILET: "ห้องน้ำ",
  EMERGENCY: "ทางออกฉุกเฉิน",
  STAIRS: "บันได",
};

// --- Layouts ---
export const layout7m: BusLayout = {
  id: '7m',
  name: 'รถตู้ 7.3 เมตร',
  rows: [
    ['DOOR1', null, null, 'DRIVER'],
    ['1A', '1B', null, null],
    ['2A', '2B', null, null],
    ['3A', '3B', null, '3D'],
    ['4A', '4B', null, '4D'],
    ['5A', '5B', null, '5D'],
    ['6A', '6B', null, '6D'],
    ['7A', '7B', '7C', '7D'],
  ],
};

export const layout12m: BusLayout = {
  id: '12m',
  name: 'รถบัส 12 เมตร',
  rows: [
    ['DOOR1', null, null, 'DRIVER'],
    ['1A', '1B', '1C', '1D'],
    ['2A', '2B', '2C', '2D'],
    ['3A', '3B', '3C', '3D'],
    ['4A', '4B', '4C', '4D'],
    ['TOILET', null, '5C', '5D'],
    ['DOOR2', null, '6C', '6D'],
    ['5A', '5B', '7C', '7D'],
    ['6A', '6B', null, 'EMERGENCY'],
    ['7A', '7B', '8C', '8D'],
    ['8A', '8B', '9C', '9D'],
  ],
};

// --- Helpers ---
export function getBusLayout(busType: string, totalSeats: number): BusLayout {
  if (totalSeats <= 24 || busType.includes('VIP 24') || busType.includes('First Class')) {
    return layout7m;
  }
  return layout12m;
}

export function isSpecialCell(label: string | null): boolean {
  return label !== null && SPECIAL_CELLS.includes(label);
}

export const generateSeats = (layout: BusLayout): Seat[] => {
  const seats: Seat[] = [];
  layout.rows.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell === null || isSpecialCell(cell)) return;
      seats.push({
        id: `s-${cell}`,
        number: cell,
        row: rowIdx,
        col: colIdx,
        status: "available",
        floor: 1,
      });
    });
  });
  return seats;
};

// --- Main Page ---
const PlanChair: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);

    const layout = useMemo(() => {
        if (!trip) return layout12m;
        const busTypeName = trip.bus_type?.name || '';
        return getBusLayout(busTypeName, trip.total_seats || 40);
    }, [trip]);

    const initialSeats = useMemo(() => generateSeats(layout), [layout]);

    const fetchTripAndSeats = async () => {
        // 1. Fetch Trip
        const { data: tripData, error: tripError } = await supabase
            .from("trips")
            .select("*, route_id(*), bus_type:bus_type_id(*)")
            .eq("id", id)
            .single();

        if (tripError) {
            console.error("Error fetching trip:", tripError);
            return;
        }
        setTrip(tripData as any);

        // 2. Fetch occupied seats
        const { data: seatData, error: seatError } = await supabase
            .from("seats")
            .select("*")
            .eq("trip_id", id);

        if (seatError) {
            console.error("Error fetching seats:", seatError);
            return;
        }

        const mergedSeats = initialSeats.map(s => {
            const dbSeat = seatData?.find(ds => ds.seat_number.trim().toUpperCase() === s.number.trim().toUpperCase());
            if (dbSeat) {
                return {
                    ...s,
                    id: dbSeat.id,
                    status: (dbSeat.is_available ? "available" : "booked") as SeatStatus,
                    price: dbSeat.price
                };
            }
            return s;
        });
        setSeats(mergedSeats);
    }

    useEffect(() => {
        fetchTripAndSeats();
    }, [id, initialSeats]);

    const toggleSeat = useCallback((seatId: string) => {
        setSeats((prev) =>
            prev.map((s) => {
                if (s.id !== seatId) return s;
                if (s.status === "booked" || s.status === "unavailable") return s;
                if (s.status === "selected") return { ...s, status: "available" };
                return { ...s, status: "selected" };
            })
        );
    }, []);

    const handleContinue = () => {
        // Since this is for employee view, we just go back
        history.goBack();
    }

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/trip/${id}`} text="" />
                    </IonButtons>
                    <IonTitle style={{ color: "#FFF" }}>แผงที่นั่ง</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="bg-slate-50">
                <div className="planchair-container p-4 flex flex-col items-center">
                    {/* Header Info */}
                    {trip && (
                        <div className="planchair-header w-full mb-6 text-center">
                            <h2 className="text-xl font-black text-slate-800">
                                {trip.route_id?.origin} → {trip.route_id?.destination}
                            </h2>
                            <p className="text-slate-500 text-sm">
                                {moment(trip.date).format('DD MMM YYYY')} | {trip.departure_time} - {trip.arrival_time}
                            </p>
                            <div className="bus-type-badge mt-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                {layout.name}
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="planchair-legend w-full max-w-md">
                        <div className="legend-item">
                            <div className="legend-box available" /> 
                            <span>ว่าง</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box selected" /> 
                            <span>เลือก</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box booked" /> 
                            <span>จองแล้ว</span>
                        </div>
                    </div>

                    {/* Bus Layout Grid */}
                    <div className="bus-grid-card w-full max-w-sm mb-8">
                        {/* Bus Windshield effect */}
                        <div className="bus-windshield"></div>
                        
                        <div className="space-y-4">
                            {layout.rows.map((row, rowIdx) => (
                                <div key={rowIdx} className="bus-row">
                                    {row.map((cell, colIdx) => {
                                        const isAisle = colIdx === 1 && (layout.id === '12m' || layout.id === '7m');
                                        const aisleClass = isAisle ? "aisle-margin" : "";

                                        if (cell === null) {
                                            return <div key={colIdx} className={`seat-null ${aisleClass}`} />;
                                        }

                                        if (isSpecialCell(cell)) {
                                            return (
                                                <div key={colIdx} className={`special-cell ${aisleClass}`}>
                                                    {cell === 'DRIVER' && <CircleDot className="driver-icon" />}
                                                    {cell === 'TOILET' && <Toilet className="lucide-icon" />}
                                                    {cell.startsWith('DOOR') && <DoorOpen className="lucide-icon" />}
                                                    {cell === 'STAIRS' && <MoveDown className="lucide-icon" />}
                                                    {cell === 'EMERGENCY' && <TriangleAlert className="lucide-icon emergency-icon" />}
                                                    <span className="special-cell-label">{specialCellLabels[cell] || cell}</span>
                                                </div>
                                            );
                                        }

                                        const seat = seats.find(s => s.number === cell);
                                        if (!seat) return <div key={colIdx} className={`w-12 h-12 ${aisleClass}`} />;

                                        return (
                                            <button
                                                key={seat.number}
                                                onClick={() => {
                                                    if (seat.status === 'booked') {
                                                        // Example: Show info or alert
                                                        console.log("Booked seat clicked:", seat.number);
                                                    } else {
                                                        toggleSeat(seat.id);
                                                    }
                                                }}
                                                disabled={seat.status === "unavailable"}
                                                className={`seat-button ${statusClasses[seat.status]} ${aisleClass}`}
                                            >
                                                {seat.status === "booked" ? (
                                                    <div className="flex flex-col items-center">
                                                        <User className="w-4 h-4 mb-0.5" />
                                                        <span className="text-[7px] leading-none">{seat.number}</span>
                                                    </div>
                                                ) : (
                                                    seat.number
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        
                        {/* Bus Rear bumper effect */}
                        <div className="bus-bumper"></div>
                    </div>

                    <IonButton 
                        expand="block" 
                        className="w-full max-w-sm" 
                        mode="ios" 
                        color="primary"
                        onClick={handleContinue}
                    >
                        ย้อนกลับ
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PlanChair;