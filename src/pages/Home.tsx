import { IonChip, IonContent, IonHeader, IonLabel, IonLoading, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonText, IonToolbar } from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';

import './css/Home.css';
import moment from 'moment';
import { BouceAnimation } from '../components/Animations';
import { supabase } from '../supabase/supabase';
moment.locale('th'); // set Thai locale for date formatting

import { Trip } from '../types/trip';
import { getDriverTrips } from '../http/api';
const Home: React.FC = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [segment, setSegment] = useState<any>('active');
  const [isLoading, setIsLoading] = useState(false);

  const getdriverTrips = async () => { 
    const token = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session') || '{}').access_token : null;
    const tripsData:any[] = await getDriverTrips(moment().format(), token);
    console.log("tripsData ", tripsData);
    setTrips(tripsData);
  }

  useEffect(() => {
    getdriverTrips();
    console.log("trips ", trips);
  }, []);

  const hellotime = (() => {
    const hour = moment().hour();
    if (hour < 12) return 'ตอนเช้า';
    if (hour < 16) return 'ตอนบ่าย';
    if (hour < 20) return 'ตอนเย็น';
    return 'ตอนดึก';
  })();

 

  // const tripsFilter = useCallback((trips: Trip[]) => {
  //   const v = (query || '').trim().toLowerCase();
  //   if (!v) {
  //     return trips;
  //   }
  //   return trips.filter(t => {
  //     const title = t.route_id?.id.toLowerCase() || '';
  //     const time = t.departure_time || '';
  //     const date = t.date ? moment(t.date).format('DD MMMM YYYY').toLowerCase() : '';
  //     return title.includes(v) || time.includes(v) || date.includes(v);
  //   });
  // }, [query])


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
                <div className="text-sm text-gray-500" style={{ color: "#FFF" }}> {moment().format('DD MMMM ,YYYY')} </div>
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
          <br />
          <IonSearchbar
            mode='ios'
            placeholder="ค้นหาเที่ยวรถ..."
            className='ion-no-padding search-trip'
            value={query}
            onIonInput={(e: any) => setQuery(e.detail?.value ?? '')}
          />
          <br />
          <IonSegment mode='ios' value={segment} onIonChange={(e) => setSegment(e.detail.value as any)} className="mb-4">
            <IonSegmentButton value="active">
              <IonLabel>เที่ยวปัจจุบัน</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="ended">
              <IonLabel>สิ้นสุดแล้ว</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* <IonList color='transparent'> */}
          <IonToolbar color={"transparent"}>
            <IonText className="text-lg font-semibold" slot='start' color={"dark"} >
              <strong>เที่ยวรถ</strong>
            </IonText>
            {/* <IonText className="text-sm  " color={"primary"} slot='end'>ทั้งหมด </IonText> */}
          </IonToolbar>
          {trips.map((trip, index) => (
            <BouceAnimation duration={(index + 2) / 10} className="card-executive" key={trip.tripId}>
              <CardTrip
                title={`${trip.origin} - ${trip.destination}`}
                time={trip.departureTime}
                arrive={trip.arrivalTime}
                disabledSeat={0}
                tripdate={trip.date}
                passengerOnboard={  trip.checkedIn}
                totalPassenger={trip.totalSeats}
                isOnBoard={moment(`${trip.date} ${trip?.departureTime}`).isBefore(moment())}
                select={() => history.push(`/trip/${trip.tripId}`)}
              />
            </BouceAnimation>
          ))}
          {/* </IonList> */}
        </div>
      </IonContent>
      <IonLoading
        isOpen={isLoading}
        onDidDismiss={() => setIsLoading(false)}
        message="กำลังโหลดข้อมูลเที่ยวรถ..."
      />
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
  isEnded?: boolean;
  select(): void;
}

const CardTrip: React.FC<CardTripProps> = ({ title, time, arrive, disabledSeat, tripdate, passengerOnboard, totalPassenger, isOnBoard, isEnded, select }) => {
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
            <p className="text-xs text-gray-400 mt-4" style={{ marginTop: ".5rem" }} >
              {tripdate && moment(tripdate).format('DD MMMM YYYY')}
            </p>
          </IonLabel>
        </div>
        <div className='text-right'>
          <IonChip color={isEnded ? "medium" : isOnBoard ? "success" : "warning"} className="ion-margin-bottom" >
            {isEnded ? "สิ้นสุด" : isOnBoard ? "กำลังเดินทาง" : "ยังไม่ถึงเที่ยว"}
          </IonChip>
          <p className='text-gray-400' style={{ fontSize: ".7em" }}>ผู้โดยสาร: ({passengerOnboard}/{totalPassenger}) <br />
            Disabled: {disabledSeat || 0}</p>
        </div>
      </div>
    </div>
  );
}