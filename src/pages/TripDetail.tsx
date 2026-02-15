import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCarSide, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonText, IonBackButton, IonLabel, IonIcon, IonChip } from '@ionic/react';
import moment, { duration } from 'moment';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  // mock data to match mockup
  const trip = {
    id: '1',
    title: 'โคราช - กทม.',
    time: '07:20',
    arrive: '09:40',
    tripdate: "2024-06-20",
    passsengerOnboard: 25,
    totalPassenger: 37,
    disabledSeat: 3,
    isOnBoard: true,
    bus: 'Premium Bus',
    seats: 40,
    code: 'TRIP12345',
    departure: "โคราช",
    destination: "กรุงเทพฯ",
    duration: "2 ชม. 20 นาที",  
    facilities: "WiFi, ปลั๊กชาร์จ, ผ้าห่ม, น้ำดื่ม, ขนม",
    tripStation: [
      {
        id: '1',
        name: 'บขส. หมอชิตใหม่ ช่องจำหน่าตั๋ว 58',
        time: '07:20',
        type: 'departure',
        passengerOnboard: 3,
        passengerOffboard: 0,
      },
      {
        id: '2',
        name: 'บขส. หมอชิตใหม่ ชานชลา 119',
        time: '08:00',
        type: 'stopover',
        passengerOnboard: 2,
        passengerOffboard: 0,
      },
      {
        id: '3',
        name: 'รังสิต หน้า ม.กรุงเทพฯ',
        time: '09:40',
        type: 'arrival',
        passengerOnboard: 1 ,
        passengerOffboard: 0,
      },
      {
        id: '4',
        name: 'นวนคร รพ.การุญเวช',
        time: '09:40',
        type: 'arrival',
        passengerOnboard: 0 ,
        passengerOffboard: 1,
      },
      {
        id: '5',
        name: 'วังน้อย (จุดปั๊มใบเวลา)',
        time: '10:00',
        type: 'arrival',
        passengerOnboard: 0 ,
        passengerOffboard: 0,
      }
    ]
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border  " >
        <IonToolbar className='ion-no-padding' color={"primary"}>
          <div className="grid grid-rows-1 ion-padding-horizontal ion-padding-top bg-primary text-white  "
            >
            <div>
              <IonButton fill='clear' onClick={()=>{history.goBack()}} >
                <FontAwesomeIcon icon={faArrowLeft} className='text-light  ' />  &nbsp;&nbsp;
                <IonText className='text-light' >Trip Details</IonText>
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent color={"light"} className="ion-no-padding min-h-screen" style={{ position: "relative", }} >
        <div className="grid grid-rows-2   ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
          style={{ borderBottomLeftRadius: "4rem", borderBottomRightRadius: "4rem", paddingBottom: "4rem" }} >

          <div className='grid grid-cols-3 gap-2 text-light ion-margin-horizontal ' >
            <div>
              <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em" }} >{trip.departure}</IonLabel>
            </div>
            <div className='ion-text-center flex items-center justify-center' >
              <FontAwesomeIcon icon={faArrowRight} style={{ fontWeight: "bolder", fontSize: "1.2em" }} />
            </div>
            <div className='ion-text-right'>
              <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em" }}>{trip.destination}</IonLabel>
            </div>
          </div>
          <div className='  flex justify-center items-center w-full' >
            <div className='text-light' style={{ width: "10%" }}><FontAwesomeIcon icon={faCarSide} /> </div>
            <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
          </div>
          <div className='ion-margin-horizontal ion-text-right ' >
            <IonLabel className='text-light' style={{ fontSize: "0.8em" }} >{trip.tripdate && moment(trip.tripdate).format('DD MMMM , YYYY')}</IonLabel>
          </div>
        </div>
        <div style={{width:"100%",marginTop: "-2rem",  flexDirection:"column", alignItems:"center", justifyContent:"center"}} 
         className='flex flex-column items-center justify-center '
         >
          <div className='bg-white grid grid-cols-3 gap-4 shadow-lg  rounded-lg p-4  shadow-md '
            style={{ borderRadius: "1rem",   zIndex: 99 , width:"90%", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} >
            <div className='ion-text-center'> 
              <p style={{lineHeight:"1.5em"}} >
                <small className='text-dark'>ต้นทางรถอก</small>  <br/>
                <IonLabel className='text-2xl ' ><strong>{trip.time}</strong></IonLabel> <br/>
                <IonLabel className='text-sm text-meduim' >{trip.departure}</IonLabel>
              </p>
            </div>
            
            <div className='flex  justify-center items-center' style={{flexDirection:"column"}}> 
              <small className='text-meduim'>{trip.duration}</small>
              <img src="/assets/svg/bus-route.svg" alt="Bus Route" style={{width:"100%",  }} />
            </div>
            <div className='ion-text-center'>
              <p style={{lineHeight:"1.5em"}} >
                <small className='text-dark text-xs'>ปลายทาง</small>  <br/>
                <IonLabel className='text-2xl ' ><strong>{trip.arrive}</strong></IonLabel> <br/>
                <IonLabel className='text-sm text-meduim' >{trip.destination}</IonLabel>
              </p>
            </div>
          </div><br/><br/>

          <div className='bg-white grid grid-rows-3 gap-4 shadow-md  rounded-lg p-4  shadow-md ion-padding '
            style={{ borderRadius: "1rem",   zIndex: 99 , width:"90%", border:"1px solid #ececec", boxShadow:" rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"}} >
            <div>
              <IonText color={"primary"}>
               <FontAwesomeIcon icon={faCarSide} className='text-md ' />
                <IonText className='ion-margin-start' color={"dark"}>ข้อมูลรถบัส</IonText>
              </IonText>
            </div>
            <div>
              <IonText className='text-medium text-xs'>{trip.bus}</IonText> <br/>
            </div>
            <div>
              <IonText className='text-medium text-xs'>สิ่งอำนวยความสะดวก : {trip.facilities}</IonText> <br/>
            </div>
          </div>

          <br/> 
          <div  className='ion-text-left ion-padding' style={{width:"100%"}}  >
          <IonLabel className='text-dark text-sm text-bold ion-margin-start' >
            จุดรับ & จุดขึ้น
          </IonLabel> 
          </div> 

          <div className='bg-white grid grid-rows-3 gap-4 shadow-md  rounded-lg p-4  shadow-md ion-padding '
            style={{ borderRadius: "1rem",   zIndex: 99 , width:"90%", border:"1px solid #ececec", boxShadow:" rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"}} >
              {trip.tripStation.map((station) => (
                <StationTrip key={station.id} station={station} />
              ))} 
            </div>
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default TripDetail;


const StationTrip: React.FC<{ station: any }> = ({ station }) => {
  return (
    <div className='grid grid-cols-12 gap-4 ' style={{padding:".3rem 0 .3rem .3rem" , borderBottom:"1px solid #f6f6f6"}} >
      <div className='flex flex-center items-center ' >
        <div className=' rounded-full bg-tertiary-tint flex items-center justify-center  ' style={{width:"2rem", height:"2rem"}} > 
         <IonText color={"primary"}  className='text-sm' >
          <FontAwesomeIcon icon={faLocationDot}  />
         </IonText>
         
        </div>
      </div>
      <div className='col-span-8 ion-padding-start'>
         <IonLabel className='text-sm text-dark' >{station.name}</IonLabel> <br/>
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
  );
}