import { IonButton, IonChip, IonContent, IonHeader, IonLabel, IonList, IonPage, IonSearchbar, IonText, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';

import './css/Home.css';
import moment from 'moment';
import 'moment/locale/th'; // import Thai locale for moment
import { BouceAnimation } from '../components/Animations';
moment.locale('th'); // set Thai locale for date formatting

const mockTrips = [
  { id: '1', title: 'โคราช - กทม.', time: '07:20', arrive: '09:40', tripdate: "2024-06-20", passsengerOnboard: 25, totalPassenger: 37, disabledSeat: 3, isOnBoard: true },
  { id: '2', title: 'กทม. - โคราช', time: '10:30', arrive: '18:00', tripdate: "2024-06-20", passsengerOnboard: 30, totalPassenger: 40, disabledSeat: 0, isOnBoard: false },
  { id: '3', title: 'โคราช - กทม.', time: '12:00', arrive: '14:20', tripdate: "2024-06-21", passsengerOnboard: 20, totalPassenger: 40, disabledSeat: 0, isOnBoard: false },
  { id: '4', title: 'กทม. - โคราช', time: '15:30', arrive: '23:00', tripdate: "2024-06-21", passsengerOnboard: 35, totalPassenger: 40, disabledSeat: 0, isOnBoard: false },
];

const Home: React.FC = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState(mockTrips);
  const [role, setRole] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const r = localStorage.getItem('role');
    setRole(r);
    const saved = localStorage.getItem('driver_elapsed');
    if (saved) setElapsed(Number(saved) || 0);
  }, []);

  useEffect(() => {
    if (running && !paused) {
      startRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, paused]);

  useEffect(() => {
    localStorage.setItem('driver_elapsed', String(elapsed));
  }, [elapsed]);

  const handleStart = () => {
    setRunning(true);
    setPaused(false);
  };

  const handleStop = () => {
    if (!confirm('ยืนยันการหยุดปฏิบัติงานและบันทึกเวลา?')) return;
    setRunning(false);
    setPaused(false);
    setElapsed(0);
    localStorage.removeItem('driver_elapsed');
  };

  const handlePause = () => {
    setPaused(p => !p);
    if (!paused) {
      // pausing
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // resuming handled by effect
    }
  };
 
  const hellotime = (() => {
    const hour = moment().hour();
    if (hour < 12) return 'ตอนเช้า';
    if (hour < 16) return 'ตอนบ่าย';
    if (hour < 20) return 'ตอนเย็น';
    return 'ตอนดึก';
  })();

  const searchMockupTrip = (q: string) => {
    const v = (q || '').trim().toLowerCase();
    setQuery(q);
    if (!v) {
      setTrips(mockTrips);
      return;
    }
    const filtered = mockTrips.filter(t => {
      const title = t.title?.toLowerCase() || '';
      const time = t.time || '';
      const date = t.tripdate ? moment(t.tripdate).format('DD MMMM YYYY').toLowerCase() : '';
      return title.includes(v) || time.includes(v) || date.includes(v);
    });
    setTrips(filtered);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border  " >
        <IonToolbar className='ion-no-padding' color={"primary"}>
          <div className="flex justify-between items-center mb-4 ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
            style={{ borderBottomLeftRadius: "2rem", borderBottomRightRadius: "2rem" }}>
            <div className='ion-padding-bottom'>
              <IonText color={"light"} >
                <h2 className="text-xl font-semibold " style={{ color: "#FFF" }} >
                  สวัสดี {hellotime}
                </h2>
              </IonText>
              <IonText color={"light"} >
                <div className="text-sm text-gray-500" style={{color:"#FFF"}}> {moment().format('DD MMMM ,YYYY')} </div>
              </IonText>
            </div>
            <div className="p-2 bg-gray-100 rounded-full text-white shadow flex items-center justify-center  "
              style={{ width: "3rem", height: "3rem", fontSize: "1.5rem", backgroundColor: "#FFF" }}
              onClick={() => { history.push("/scanQrPage") }}
            >
              <IonText color={"primary"} >
                <FontAwesomeIcon icon={faQrcode} />
              </IonText>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-white min-h-screen"  >
        <div style={{ width: "100%", height: "100vh", overflowY: "scroll", paddingBottom: "20vh" }} >
          <br/>
          <IonSearchbar 
            mode='ios'
            placeholder="ค้นหาเที่ยวรถ..."
            className='ion-no-padding search-trip'
            value={query}
            onIonInput={(e: any) => searchMockupTrip(e.detail?.value ?? '')}
          />
          <br />
          {/* <IonList color='transparent'> */}
            <IonToolbar color={"transparent"}>
              <IonText className="text-lg font-semibold" slot='start' color={"dark"} >
                <strong>เที่ยวรถ</strong>
              </IonText>
              <IonText className="text-sm  " color={"primary"} slot='end'>ทั้งหมด </IonText>
            </IonToolbar>
            {trips.map((trip , index) => (
            <BouceAnimation duration={(index+2)/10} className="card-executive"  key={trip.id}> 
              <CardTrip 
                title={trip.title} time={trip.time}
                arrive={trip.arrive}
                disabledSeat={trip.disabledSeat}
                tripdate={trip.tripdate}
                passengerOnboard={trip.passsengerOnboard}
                totalPassenger={trip.totalPassenger}
                isOnBoard={trip.isOnBoard}
                select={() => history.push(`/trip/${trip.id}`)}
              />
            </BouceAnimation>
            ))}
          {/* </IonList> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

interface CardTripProps {
  title: string;
  time: string;
  arrive: string;
  disabledSeat?: number;
  tripdate?: string;
  passengerOnboard: number;
  totalPassenger?: number;
  isOnBoard?: boolean;
  select(): void;
}

const CardTrip: React.FC<CardTripProps> = ({ title, time, arrive, disabledSeat, tripdate, passengerOnboard, totalPassenger, isOnBoard, select }) => {
  return (
    <div className="card-trip ion-margin-bottom  bg-white shadow  border-1 border-solid  " onClick={() => select()} >
      <div className="grid grid-cols-3 p-4">

        <div className="text-sm text-gray-500 col-span-2" >
          <div className="font-medium ion-padding-bottom"  >
            <IonLabel style={{ fontSize: "large" }}> <b> {title} </b> </IonLabel>
          </div>
          <IonLabel style={{ fontSize: "medium" }}>
            <FontAwesomeIcon icon={faClock} /> &nbsp;
            <IonText>{time} - {arrive}</IonText>
            <p className="text-xs text-gray-400 mt-1"  >
              {tripdate && moment(tripdate).format('DD MMMM YYYY')}
            </p>
          </IonLabel>
        </div>
        <div className='text-right'>
          <IonChip color={isOnBoard ? "success" : "warning"} className="ion-margin-bottom" >
            {isOnBoard ? "ถึงเที่ยว" : "ยังไม่ถึงเที่ยว"}
          </IonChip>
          <p className='text-gray-400' style={{ fontSize: ".7em" }}>ผู้โดยสาร: ({passengerOnboard}/{totalPassenger}) <br />
            Disabled: {disabledSeat || 0}</p>
        </div>
      </div>
    </div>
  );
}