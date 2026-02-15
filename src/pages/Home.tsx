import { IonButton, IonChip, IonContent, IonHeader,  IonLabel, IonList,  IonPage, IonText,  IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import { faClock  } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';

import './css/Home.css'; 
import moment from 'moment';
import 'moment/locale/th'; // import Thai locale for moment
moment.locale('th'); // set Thai locale for date formatting

const mockTrips = [
  { id: '1', title: 'โคราช - กทม.', time: '07:20' , arrive:'09:40' , tripdate:"2024-06-20" , passsengerOnboard: 25 , totalPassenger: 37 , disabledSeat: 3 , isOnBoard: true },
  { id: '2', title: 'กทม. - โคราช', time: '10:30' , arrive:'18:00' , tripdate:"2024-06-20" , passsengerOnboard: 30 , totalPassenger: 40 , disabledSeat: 0 , isOnBoard: false},
  { id: '3', title: 'โคราช - กทม.', time: '12:00' , arrive:'14:20' , tripdate:"2024-06-21" , passsengerOnboard: 20 , totalPassenger: 40, disabledSeat: 0, isOnBoard: false},
  { id: '4', title: 'กทม. - โคราช', time: '15:30' , arrive:'23:00' , tripdate:"2024-06-21" , passsengerOnboard: 35 , totalPassenger: 40, disabledSeat: 0 , isOnBoard: false},
];

const Home: React.FC = () => {
  const history = useHistory();
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

  const format = (s: number) => {
    const hh = Math.floor(s / 3600).toString().padStart(2, '0');
    const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const hellotime = (() => {
    const hour = moment().hour();
    if (hour < 12) return 'ตอนเช้า';
    if (hour < 16) return 'ตอนบ่าย';
    if (hour < 20) return 'ตอนเย็น';
    return 'ตอนดึก';
  })();

  return (
    <IonPage>
      <IonHeader className="ion-no-border ion-padding-bottom" >
        <IonToolbar className='ion-no-padding' color={"primary"}>  
          <div className="flex justify-between items-center mb-4 ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
           style={{borderBottomLeftRadius:"2rem" , borderBottomRightRadius:"2rem"}}>
            <div className='ion-padding-bottom'>
              <IonText color={"light"} >
              <h2 className="text-xl font-semibold ">
                สวัสดี {hellotime}
              </h2>
              </IonText>
              <IonText color={"light"} >
              <div className="text-sm text-gray-500"> {moment().format('DD MMMM ,YYYY')} </div>
              </IonText>
            </div> 
            <div className="p-2 bg-gray-100 rounded-full bg-light text-white shadow flex items-center justify-center  "
              style={{width:"3rem" , height:"3rem",fontSize:"1.5rem"}}
            >
              <IonText color={"primary"} >
                <FontAwesomeIcon icon={faQrcode} />
              </IonText> 
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding bg-white min-h-screen">
        
    <div className="w-100" style={{width:"100%"}} >
          {role === 'driver' ? (
            <div className="  pt-8">
              {!running ? (
                <div className="  items-center"> 
                  <IonButton expand='block' mode='ios' onClick={handleStart} className=" text-light rounded-4xl" >
                    เริ่มปฏิบัติงาน
                  </IonButton>
                </div>
              ) : (
                <div className="w-full"> 
                  <div className="grid grid-cols-3   gap-4 ">
                    <button onClick={handleStop} className="flex flex-col flex-row items-center bg-white  p-3 w-32 shadow bg-primary text-light " 
                    style={{borderRadius:".7rem" ,padding:"0.5em 1em" , margin:"0.2em"}} > 
                      <div className="text-sm mt-2">
                        <IonText>หยุดปฏิบัติงาน</IonText>
                      </div>
                    </button>
                    <div className="flex flex-col items-start border-2 border-solid border-primary text-primary  " 
                      style={{borderRadius:".7rem" ,padding:"0.5em 1em" , margin:"0.2em"}}  >
                      <IonLabel color={"primary"} className="text-sm ion-text-left"><small>ระยะเวลา</small></IonLabel>
                      <IonLabel color={"primary"} className="text-lg "><b>{format(elapsed)} </b></IonLabel>
                    </div>
                    <button onClick={handlePause}  className="flex flex-col flex-row items-center border-2 border-solid border-primary text-primary bg-light" 
                      style={{borderRadius:".7rem" ,padding:"0.5em 1em" , margin:"0.2em"}} >
                        <IonText color={"primary"} >
                          <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-yellow-500 " />
                        </IonText>&nbsp;
                      <div className="text-sm mt-2">
                        <IonText color={"primary"}>{paused ? 'ต่อ' : 'พักงาน'}</IonText>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded">
              ยินดีต้อนรับ (role: {role || 'n/a'})
            </div>
          )}
        </div>

          <br/>
        <IonList> 
          <IonToolbar color={"transparent"}>
            <IonText className="text-lg font-semibold"  slot='start' >
              <strong>เที่ยวรถ</strong>
            </IonText>
            <IonText className="text-sm  " color={"primary"} slot='end'>ทั้งหมด </IonText>
          </IonToolbar>
          {mockTrips.map(trip => ( 
            <CardTrip 
              key={trip.id} 
              title={trip.title} time={trip.time} 
              arrive={trip.arrive} 
              disabledSeat={trip.disabledSeat} 
              tripdate={trip.tripdate}
              passengerOnboard={trip.passsengerOnboard}
              totalPassenger={trip.totalPassenger}
              isOnBoard={trip.isOnBoard}
              select={() =>  history.push(`/trip/${trip.id}`) }
            />
          ))} 
        </IonList>
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

const CardTrip: React.FC<CardTripProps> = ({ title, time, arrive, disabledSeat, tripdate, passengerOnboard,totalPassenger, isOnBoard, select }) => {
  return ( 
    <div  className="card-trip ion-margin-bottom  bg-white shadow  border-1 border-solid  " onClick={() => select()} >
      <div className="grid grid-cols-3 p-4">
      
        <div className="text-sm text-gray-500 col-span-2" >
            <div className="font-medium ion-padding-bottom"  >
            <IonLabel style={{fontSize:"large"}}> <b> {title} </b> </IonLabel>
            </div>
              <IonLabel style={{fontSize:"medium"}}>
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
            <p className='text-gray-400'  style={{fontSize:".7em"}}>ผู้โดยสาร: ({passengerOnboard}/{totalPassenger}) <br/>
             Disabled: {disabledSeat || 0}</p>
          </div> 
      </div>
    </div>
  );
}