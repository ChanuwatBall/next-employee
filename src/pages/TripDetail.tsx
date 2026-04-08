import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCarSide, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonText, IonBackButton, IonLabel, IonIcon, IonChip, IonAccordion, IonAccordionGroup } from '@ionic/react';
import moment, { duration } from 'moment';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './css/TripDetail.css';
import { BouceAnimation } from '../components/Animations';
import { supabase } from '../supabase/supabase';

import { Trip } from '../types/trip';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [stationacc, setStationAcc] = React.useState<string>("");
  const [trip, setTrip] = React.useState<Trip | null>(null);
 
  const getTrip = async () => {
    const { data, error } = await supabase.from('trips')
      .select('*, route_id(*)')
      .eq('id', id)
      .single();
    if (error) {
      console.log(error);
    }
    if (data) {
      const {data:dataBooking , error:bookingError} = await supabase.from('bookings').select('*')
        .eq('trip_id', id)
      if(bookingError){
        throw bookingError
      }
     console.log("dataBooking ", dataBooking);

      const {data:dataSeats , error:seatsError} = await supabase.from('seats').select('*').eq('trip_id', id)
      if(seatsError){
        throw seatsError
      }
     
      const { data: busStops, error: busStopsError } = await supabase.from('bus_stops')
        .select('*')
        .eq('route_id', data.route_id.id)
      if (busStopsError) {
        throw busStopsError
      }
      console.log("busStops ", busStops);
      for(const bsp of busStops){
        let passengerOnboard = 0;
        let passengerOffboard = 0;
        for(const booking of dataBooking){
          if(booking.pickup_stop === bsp.name){
            const isonboard = dataBooking.filter((b) => b.pickup_stop === bsp.name );
           if(isonboard){
            console.log( bsp.name + " isonboard ", isonboard);
            passengerOnboard += isonboard.length
           }
          }
          if(booking.dropoff_stop === bsp.name){
            const isoffboard = dataBooking.filter((b) => b.dropoff_stop === bsp.name );
            
           if(isoffboard){
            console.log( bsp.name + " isoffboard ", isoffboard);
            passengerOffboard += isoffboard.length
          }
        }
        }
        bsp.passengerOnboard = passengerOnboard;
        bsp.passengerOffboard = passengerOffboard;
      }
      data.bus_stops = busStops

      const { data: bustype, error: bustypeError } = await supabase.from('bus_types')
        .select('*')
        .eq('id', data.bus_type_id)
        .single()
      if (bustypeError) {
        throw bustypeError
      }
      data.bus_type = bustype
      console.log("data ", data);
      setTrip(data as any);
    }
  }

  useEffect(() => {
    getTrip()
  }, [])
  return (
    <IonPage>
      <IonHeader className="ion-no-border  " >
        <IonToolbar className='ion-no-padding' color={"primary"}>
          <div className="grid grid-rows-1 ion-padding-horizontal ion-padding-top bg-primary text-white  "
          >
            <div>
              <IonButton fill='clear' style={{ color: "#FFF" }} onClick={() => { history.goBack() }} >
                <FontAwesomeIcon icon={faArrowLeft} />  &nbsp;&nbsp;
                <IonText  >Trip Details</IonText>
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent color={"light"} className="ion-no-padding min-h-screen" style={{ position: "relative" }} >
        {trip && <div>
          <div className="grid grid-rows-2   ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
            style={{ borderBottomLeftRadius: "3rem", borderBottomRightRadius: "3rem", paddingBottom: "4rem" }} >

            <div className='grid grid-cols-12 gap-2 text-light ion-margin-horizontal items-center' >
              <div className='col-span-5 overflow-hidden'>
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }} >{trip.route_id?.origin}</IonLabel>
              </div>
              <div className='col-span-2 ion-text-center flex items-center justify-center ' >
                <FontAwesomeIcon icon={faArrowRight} style={{ fontWeight: "bolder", fontSize: "1.2em", color: "#FFF" }} />
              </div>
              <div className='col-span-5 ion-text-right overflow-hidden'>
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }}>{trip.route_id?.destination}</IonLabel>
              </div>
            </div>
            <div className='  flex justify-center items-center w-full' >
              <div className='text-light' style={{ width: "10%", color: "white" }}><FontAwesomeIcon icon={faCarSide} /> </div>
              <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
            </div>
            <div className='ion-margin-horizontal ion-text-right ' >
              <IonLabel className='text-light' style={{ fontSize: "0.8em", color: "white" }} >{trip.date && moment(trip.date).format('DD MMMM , YYYY')}</IonLabel>
            </div>
          </div>
          <div style={{ width: "100%", marginTop: "-2rem", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            className='flex flex-column items-center justify-center '
          >

            <BouceAnimation duration={0.1} className="card-executive bg-white grid grid-cols-3 gap-4  rounded-lg  raduis-shadow " key={trip.id}
            >
              <div className='ion-text-center'>
                <p style={{ lineHeight: "1.5em" }} >
                  <small className='text-meduim'>ต้นทางรถอก</small>  <br />
                  <IonLabel className='text-2xl ' color={"dark"} ><strong>{trip.departure_time}</strong></IonLabel> <br />
                  <IonLabel className='text-sm text-meduim' >{trip.route_id?.origin}</IonLabel>
                </p>
              </div>

              <div className='flex  justify-center items-center' style={{ flexDirection: "column" }}>
                <small className='text-meduim'>{trip?.route_id?.duration}</small>
                <img src="/assets/svg/bus-route.svg" alt="Bus Route" style={{ width: "100%", }} />
              </div>
              <div className='ion-text-center'>
                <p style={{ lineHeight: "1.5em" }} >
                  <small className='text-meduim text-xs'>ปลายทาง</small>  <br />
                  <IonLabel className='text-2xl ' color={"dark"}><strong>{trip.arrival_time}</strong></IonLabel> <br />
                  <IonLabel className='text-sm text-meduim' >{trip?.route_id?.destination}</IonLabel>
                </p>
              </div>
            </BouceAnimation>
            <br /><br />

            <BouceAnimation duration={0.4} delay={0.2} className='card-stations bg-white grid grid-rows-3 gap-4 shadow-md  rounded-lg p-4  shadow-md ion-padding '  >
              <div>
                <IonText color={"primary"}>
                  <FontAwesomeIcon icon={faCarSide} className='text-md ' />
                  <IonText className='ion-margin-start' color={"dark"}>ข้อมูลรถบัส</IonText>
                </IonText>
              </div>
              <div>
                <IonText className='text-xs' color={"medium"} > {trip?.bus_type?.name}</IonText> <br />
              </div>
              <div>
                <IonText className='text-xs' color={"medium"} >สิ่งอำนวยความสะดวก : {trip?.bus_type?.amenities.join(", ")}</IonText> <br />
              </div>
            </BouceAnimation>

            <br />
            <div style={{ width: "100%" }} >
              <BouceAnimation duration={0.4} delay={0.5} className='ion-text-left ion-padding' style={{ width: "100%" }}  >
                <IonLabel className='text-dark text-sm text-bold ion-margin-start' >
                  จุดรับ & จุดขึ้น
                </IonLabel>
              </BouceAnimation>
            </div>

            <BouceAnimation className=" card-stations "
              duration={0.4} delay={0.5}  >
              <IonAccordionGroup className=' ion-margin  bg-white' value={stationacc}  >
                {trip.bus_stops?.map((station) => (
                  <StationTrip key={station.id} station={station} />
                ))}
              </IonAccordionGroup>
            </BouceAnimation>
          </div>
          <div className='bottom-div' >
            <IonButton expand='block' mode='ios' className=" text-light rounded-4xl" style={{ color: "#FFF" }}
              onClick={() => { history.push("/plan/" + trip?.id) }} >
              ที่นั่งทั้งหมด
            </IonButton>
          </div>
          <div style={{ height: "15rem" }} ></div>
        </div>}
      </IonContent>
    </IonPage>
  );
};

export default TripDetail;


const StationTrip: React.FC<{ station: any }> = ({ station }) => {
  return (
    <IonAccordion value={station.id} className='ion-no-padding' >
      <div slot='header' className='grid grid-cols-12 gap-4 border-bottom' style={{ padding: ".3rem 0 .3rem .3rem", }} >
        <div className='flex flex-center items-center ' >
          <div className=' rounded-full bg-tertiary-tint flex items-center justify-center  ' style={{ width: "2rem", height: "2rem" }} >
            <IonText color={"primary"} className='text-sm' >
              <FontAwesomeIcon icon={faLocationDot} />
            </IonText>

          </div>
        </div>
        <div className='col-span-8 ion-padding-start'>
          <IonLabel className='text-sm  ' color={"dark"} >{station.name}</IonLabel> <br />
          <IonLabel className='text-xs text-meduim' >เวลา {station.time}</IonLabel>
        </div>
        <div className='col-span-3 ion-text-right'>
          <IonChip color={"tertiary"} >
            <IonLabel className='text-2xs text-dark' >
              <FontAwesomeIcon icon={faArrowUp} className='text-dark' />
              {station.passengerOnboard}
            </IonLabel>&nbsp;
            <IonLabel className='text-2xs text-dark' >
              <FontAwesomeIcon icon={faArrowDown} className='text-dark' />
              {station.passengerOffboard}  </IonLabel>
          </IonChip>
        </div>
      </div>
      <div slot='content' className='ion-padding' >
        <IonText className='text-sm text-meduim' color={"dark"} >
          <FontAwesomeIcon icon={faArrowUp} />   ผู้โดยสารที่ขึ้นสถานี นี้ : {station.passengerOnboard} คน <br />
          <FontAwesomeIcon icon={faArrowDown} />   ผู้โดยสารที่ลงสถานี นี้ : {station.passengerOffboard} คน <br />
        </IonText>
      </div>
    </IonAccordion>
  );
}