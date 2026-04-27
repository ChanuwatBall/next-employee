import { faCarSide, faBus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonText, IonBadge, IonButton } from "@ionic/react";
import moment from "moment";
import "./css/CardTrip.css"

interface CardTripProps {
    title: string;
    time: string;
    arrive: string;
    disabledSeat?: number;
    tripdate?: string;
    passengerOnboard: number;
    totalPassenger?: number;
    isOnBoard?: boolean;
    isEnded?: boolean;
    select(): void;
    busNumber?: string;
}

const CardTrip: React.FC<CardTripProps> = ({ busNumber, title, time, arrive, disabledSeat, tripdate, passengerOnboard, totalPassenger, isOnBoard, isEnded, select }) => {
    return (
        <div className={`card-trip modern ${isEnded ? 'ended' : isOnBoard ? 'active' : ''}`} style={{ paddingBottom: "10px" }} onClick={() => select()}>
            <div className="trip-main-info" style={{ margin: "0 0 .3rem" }}>
                {/* Top bar: Bus Number and Status */}
                <div className="flex justify-between items-center mb-3">
                    <div className="bus-tag bg-gray-100 text-gray-700 px-2 py-1 rounded-lg flex items-center gap-1.5">
                        <span className="font-bold text-md">{title}</span>
                    </div>
                </div>
                <small className="flex items-center" style={{ margin: "0 0 5px" }} >
                    <FontAwesomeIcon icon={faCarSide} size='lg' /> &nbsp;&nbsp;
                    <IonText color="dark" className="text-md">{busNumber || 'N/A'}</IonText>
                    <IonBadge mode="ios" color={isEnded ? "medium" : isOnBoard ? "success" : "warning"} className="status-badge ion-margin-start">
                        {isEnded ? "สิ้นสุดแล้ว" : isOnBoard ? "กำลังเดินทาง" : "เตรียมออกรถ"}
                    </IonBadge>
                </small>

                {/* Route visualization */}
                <div className="route-visual flex items-center gap-4 mb-4">
                    <div className="time-col text-center min-w-[50px]" style={{ margin: "0 .5rem" }}>
                        <div className="text-lg font-bold text-slate-800">{time}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">ออก</div>
                    </div>

                    <div className="path-col flex-grow flex items-center gap-1 px-1 text-center ion-no-padding ">
                        <div className="dot start"></div>
                        <div className="line-dashed flex-grow"></div>
                        <FontAwesomeIcon icon={faBus} className="bus-icon text-slate-300" />
                        <div className="line-dashed flex-grow"></div>
                        <div className="dot end"></div>
                    </div>

                    <div className="time-col text-center min-w-[50px]" style={{ margin: "0 0 0 .5rem" }}>
                        <div className="text-lg font-bold text-slate-800">{arrive}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">ถึง</div>
                    </div>
                </div>

                <div className="trip-footer flex justify-between items-end " style={{ padding: "5px 0", margin: "5px 0", borderTop: "1px solid #ebedf0ff" }} >
                    <div>
                        {/* <h4 className="font-bold text-slate-800 mb-1">{title}</h4> */}
                        <div className="text-xs text-slate-400">
                            {tripdate && moment(tripdate).locale("th").format('DD MMMM YYYY')}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="passenger-info flex items-center justify-end gap-1.5 text-slate-600 mb-1">
                            <FontAwesomeIcon icon={faUser} size="xs" />
                            <span className="font-bold text-sm">{passengerOnboard}/{totalPassenger}</span>
                        </div>
                        {disabledSeat ? (
                            <div className="text-[10px] text-blue-500 font-medium">♿️ ผู้พิการ: {disabledSeat}</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardTrip;