import React, { useMemo, useState, useCallback, useEffect } from "react";
import { getTripSeats } from "../https/api";
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
    IonModal,
    IonCol,
    IonRow,
    IonFooter,
} from "@ionic/react";
import { CircleDot, DoorOpen, Toilet, TriangleAlert, MoveDown, User, Armchair, X } from "lucide-react";
import { supabase } from "../supabase/supabase";
import { Trip } from "../types/trip";
import moment from "moment";
import "./css/PlanChair.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClock } from "@fortawesome/free-solid-svg-icons";

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
    ticket_id: null | {
        "id": string
        "price": number
        "status": string
        "qr_code": string
        "booking_id": string | null,
        "created_at": string | Date
        "seat_number": string
        "checked_in_at": string | null
        "ticket_number": string
        "passenger_name": string
        "passenger_type": string
        "passenger_phone": string
        "passenger_id_card": string
    }
}

interface BusLayout {
    id: string;
    name: string;
    rows: (string | null)[][];
}

interface TicketDetail {
    id: string;
    price: number;
    status: string;
    qr_code: string;
    booking_id: string | null;
    created_at: string;
    seat_number: string;
    checked_in_at: string | null;
    ticket_number: string;
    passenger_name: string;
    passenger_type: string;
    passenger_phone: string;
    passenger_id_card: string;
}

interface SeatDetail {
    id: string;
    trip_id: string;
    seat_number: string;
    seat_type: string;
    price: number;
    is_available: boolean;
    created_at: string;
    ticket_id: TicketDetail | null;
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
                ticket_id: null
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
    const [showSeatModal, setShowSeatModal] = useState(false);
    const [selectedSeatData, setSelectedSeatData] = useState<SeatDetail | null>(null);

    const [layout, setLayout] = useState<BusLayout>(layout12m);

    const fetchTripAndSeats = async () => {
        try {
            // 1. Fetch Trip from Supabase for UI info
            const { data: tripData, error: tripError } = await supabase
                .from("trips")
                .select("*, route_id(*), bus_type:bus_type_id(*)")
                .eq("id", id)
                .single();

            if (tripError && tripError.code !== 'PGRST116') {
                console.error("Error fetching trip:", tripError);
            }
            if (tripData) {
                setTrip(tripData as any);
            }

            // 2. Fetch Layout and Seats from Nex API
            const apiData = await getTripSeats(id);

            if (apiData) {
                if (apiData.layout) {
                    setLayout(apiData.layout);
                }
                if (apiData.seats) {
                    // Map API seats to our Seat type
                    const mappedSeats: Seat[] = apiData.seats.map((s: any) => ({
                        id: s.number, // Use seat number as ID for consistency with Supabase queries
                        number: s.number,
                        row: s.row,
                        col: s.col,
                        status: s.status as SeatStatus,
                        floor: s.floor,
                        ticket_id: null // Will be populated if needed when clicking
                    }));
                    console.log("mappedSeats ", mappedSeats)
                    setSeats(mappedSeats);
                }
            }
        } catch (error) {
            console.error("Error in fetchTripAndSeats:", error);
        }
    }

    useEffect(() => {
        fetchTripAndSeats();
    }, [id]);

    const toggleSeat = useCallback(async (seat: Seat) => {
        if (seat.status === "booked" || seat.status === "unavailable") {
            try {
                const { data, error } = await supabase
                    .from("seats")
                    .select("*, ticket_id(*)")
                    .eq("seat_number", seat.id)
                    .eq("trip_id", id)
                    .single();

                if (error) {
                    console.error("Error fetching seat:", error);
                    return;
                }
                console.log("Seat detail:", data);

                const { data: dataBooking, error: bookingError } = await supabase.from("bookings")
                    .select("*")
                    .eq("trip_id", id)
                    .eq("status", "confirmed")
                    .eq("payment_status", "paid")
                let bookids: any[] = [];
                if (dataBooking) {
                    console.log("data booking ", dataBooking)
                    bookids = dataBooking?.map((b: any) => b.id);
                }
                const { data: dataTicket, error: ticketError } = await supabase.from("tickets")
                    .select("*")
                    .in("booking_id", bookids)
                    .eq("seat_number", data.seat_number)
                    .eq("status", "active")
                    .single();
                if (ticketError) {
                    console.error("Error fetching ticket:", ticketError);
                    return;
                }
                data.ticket_id = dataTicket;

                console.log("Seat detail ticket:", data);


                setSelectedSeatData(data as SeatDetail);
                setShowSeatModal(true);
            } catch (error) {
                console.error("Error fetching seat:", error);
            }
            return;
        }

        setSeats((prev) =>
            prev.map((s) => {
                if (s.id !== seat.id) return s;
                if (s.status === "selected") return { ...s, status: "available" };
                return { ...s, status: "selected" };
            })
        );
    }, [id]);

    const handleContinue = () => {
        // Since this is for employee view, we just go back
        history.goBack();
    }

    const checkInSeat = async () => {
        if (!selectedSeatData) return;
        const seatNumber = selectedSeatData.seat_number;
        const tripId = id;
        const checkedAt = moment().format();
        try {
            const { data, error } = await supabase
                .from('tickets')
                .update({ checked_in_at: checkedAt })
                .eq('id', selectedSeatData.ticket_id?.id);

            if (error) {
                console.error('Error checking in ticket:', error);
                return;
            }

            // update local state to reflect check-in
            setSelectedSeatData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    ticket_id: prev.ticket_id ? { ...prev.ticket_id, checked_in_at: checkedAt } : prev.ticket_id
                } as SeatDetail;
            });

            setSeats(prev => prev.map(s => s.number === seatNumber ? { ...s, status: 'booked' } : s));

            // refresh seats/layout from server to reflect latest state
            await fetchTripAndSeats();
        } catch (err) {
            console.error('Unexpected error during check-in:', err);
        }
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
                                        const isAisle = colIdx === 1 && (layout.id.includes('12m') || layout.id.includes('7m'));
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
                                                    toggleSeat(seat);
                                                    // if (seat.status === 'booked') {
                                                    //     // Example: Show info or alert
                                                    //     console.log("Booked seat clicked:", seat.number);
                                                    // } else {

                                                    // }
                                                }}
                                                disabled={seat.status === "unavailable"}
                                                className={`seat-button ${statusClasses[seat.status]} ${aisleClass} relative`}
                                            >
                                                {seat.status === "booked" ? (
                                                    <div className="flex flex-col items-center ">
                                                        <User className="  text-slate-300" style={{ width: "80%", height: "80%", marginTop: " 0rem" }} />
                                                        <span className="text-[16px] leading-none">{seat.number}</span>
                                                    </div>
                                                ) : (<>
                                                    <Armchair className="  text-slate-300" style={{ width: "40%", height: "40%", marginTop: "-.8rem" }} />
                                                    <IonLabel style={{ position: "absolute", bottom: "6px" }}>{seat.number}</IonLabel>
                                                </>)}
                                                {seat.status === "booked" && seat?.ticket_id?.checked_in_at === null &&
                                                    <FontAwesomeIcon icon={faClock}
                                                        style={{ position: "absolute", right: "-10%", top: "-10%", color: "#f5cb42" }} />
                                                }
                                                {seat.status === "booked" && seat?.ticket_id?.checked_in_at !== null &&
                                                    <FontAwesomeIcon icon={faCircleCheck}
                                                        style={{ position: "absolute", right: "-10%", top: "-10%", color: "#30d203" }} />
                                                }
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Bus Rear bumper effect */}
                        <div className="bus-bumper"></div>
                    </div><br />

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

            {/* Booked Seat Detail — bottom sheet */}
            <IonModal
                isOpen={showSeatModal}
                initialBreakpoint={0.8}
                breakpoints={[0, 0.8, 0.9]}
                onDidDismiss={() => { setShowSeatModal(false); setSelectedSeatData(null); }}
            >
                <IonContent scrollY>
                    {selectedSeatData && (() => {
                        const ticket = selectedSeatData.ticket_id;
                        const isCheckedIn = !!ticket?.checked_in_at;
                        const passengerBadge = ticket?.passenger_type === 'male' ? 'ช' : 'ญ';
                        const calcDuration = (dep?: string, arr?: string) => {
                            if (!dep || !arr) return '-';
                            const [dh, dm] = dep.split(':').map(Number);
                            const [ah, am] = arr.split(':').map(Number);
                            const diff = (ah * 60 + am) - (dh * 60 + dm);
                            if (diff <= 0) return '-';
                            return `${Math.floor(diff / 60)}.${(diff % 60).toString().padStart(2, '0')} ชม.`;
                        };

                        return (
                            <div className="flex flex-col  ">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 pt-5 pb-4 ">
                                    <h2 className="text-lg font-bold text-slate-800 ion-margin-start">ที่นั่ง {selectedSeatData.seat_number}</h2>
                                    <button
                                        onClick={() => { setShowSeatModal(false); setSelectedSeatData(null); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 relative ion-margin-end"
                                    >
                                        <X className="w-4 h-4" />

                                    </button>
                                </div>
                                <IonRow>
                                    <IonCol size="12" className="set-center " style={{ flexDirection: "column" }}>
                                        <div className="set-center relative" style={{ width: "7rem", height: "7rem", border: "1px solid #b8b8b8", borderRadius: "1rem" }} >
                                            <Armchair className="  text-slate-300" style={{ width: "50%", height: "50%" }} />
                                            {selectedSeatData?.ticket_id && selectedSeatData?.ticket_id?.checked_in_at === null &&
                                                <FontAwesomeIcon icon={faClock}
                                                    style={{ position: "absolute", right: "20%", top: "20%", color: "#f5cb42" }} />
                                            }
                                            {selectedSeatData?.ticket_id && selectedSeatData?.ticket_id?.checked_in_at !== null &&
                                                <FontAwesomeIcon icon={faCircleCheck}
                                                    style={{ position: "absolute", right: "20%", top: "20%", color: "#30d203" }} />
                                            }
                                        </div>
                                        <p className="text-slate-400 mt-3 text-base font-medium">{selectedSeatData.seat_number}</p>
                                    </IonCol>
                                </IonRow>

                                {/* Scrollable body */}
                                <div className="flex-1 w-full " style={{ justifyContent: "flex-start", alignItems: "center", display: "flex", flexDirection: "column", paddingTop: "1rem" }} >

                                    <div className="ion-padding" style={{ backgroundColor: "#fafafa", width: "90%", borderRadius: "1rem" }} >
                                        {ticket && (
                                            <div className="col-span-3 bg-slate-50 rounded-2xl p-4 mb-3 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm text-slate-500">สถานะ</span>
                                                    <span className="text-sm font-semibold text-slate-800 text-right">
                                                        {isCheckedIn ? 'เช็คอินแล้ว' : 'จองตั๋วแล้ว รอผู้โดยสาร'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-500">ชื่อ-สกุล</span>
                                                    <span className="text-sm font-semibold text-slate-800">{ticket.passenger_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-500">หมายเลขโทรศัพท์</span>
                                                    <span className="text-sm font-semibold text-slate-800">{ticket.passenger_phone}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div> <br />

                                    {/* Passenger info card */}

                                    {/* Trip info card */}
                                    <div className="ion-padding" style={{ backgroundColor: "#fafafa", width: "90%", borderRadius: "1rem" }} >
                                        {ticket && (
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm text-slate-500">เลขจอง</span>
                                                <span className="text-xs font-mono font-semibold text-slate-800 text-right break-all max-w-[60%]">
                                                    #{ticket.ticket_number}
                                                </span>
                                            </div>
                                        )}
                                        {trip && (
                                            <>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm text-slate-500">จุดขึ้น</span>
                                                    <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%]">{trip.route_id?.origin}</span>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-sm text-slate-500">จุดลง</span>
                                                    <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%]">{trip.route_id?.destination}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-500">เวลาออก</span>
                                                    <span className="text-sm font-semibold text-slate-800">{trip.departure_time}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-500">เวลาถึง</span>
                                                    <span className="text-sm font-semibold text-slate-800">{trip.arrival_time}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-500">ระยะเวลา</span>
                                                    <span className="text-sm font-semibold text-slate-800">
                                                        {calcDuration(trip.departure_time, trip.arrival_time)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>


                            </div>
                        );
                    })()}
                    <br />
                    <div className="px-5 pb-6 pt-3 border-slate-100 flex gap-3 mt-8 ion-padding-horizontal"
                        style={{ borderTop: "1px solid #e5e5e5", width: "100%", maxWidth: "720px" }} >
                        <IonButton
                            expand="block"
                            fill="solid"
                            color="primary"
                            mode="ios"
                            className="flex-1 m-0"
                            onClick={checkInSeat}
                            disabled={!!selectedSeatData?.ticket_id?.checked_in_at}
                        >
                            เช็คอินผู้โดยสาร
                        </IonButton>
                        <IonButton
                            expand="block"
                            fill="outline"
                            color="primary"
                            mode="ios"
                            className="flex-1 m-0"
                        >
                            ติดต่อผู้โดยสาร
                        </IonButton>
                    </div>


                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default PlanChair;