import { faArrowLeft, faArrowRight, faCarSide, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonText, IonBackButton, IonLabel, IonIcon } from '@ionic/react';
import moment, { duration } from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // mock data to match mockup
  const trip =
  {
    id: '1',
    title: 'โคราช - กทม.',
    time: '07:20',
    arrive: '09:40',
    tripdate: "2024-06-20",
    passsengerOnboard: 25,
    totalPassenger: 37,
    disabledSeat: 3,
    isOnBoard: true,
    bus: 'รถทัวร์ 12 ล้อ',
    seats: 40,
    code: 'TRIP12345',
    departure: "โคราช",
    destination: "กรุงเทพฯ",
    duration: "2 ชม. 20 นาที",

  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border  " >
        <IonToolbar className='ion-no-padding' >
          <div className="grid grid-rows-1 ion-padding-horizontal ion-padding-top bg-primary text-white  "
            >
            <div>
              <IonButton fill='clear'  >
                <FontAwesomeIcon icon={faArrowLeft} className='text-light  ' />  &nbsp;&nbsp;
                <IonText className='text-light' >Trip Details</IonText>
              </IonButton>
            </div>

          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding bg-white min-h-screen" style={{ position: "relative", }} >
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
        <div style={{width:"100%",marginTop: "-2rem",overflow:"scroll", height:"50vh" , }} 
         className='flex justify-center items-start '>
          <div className='bg-white grid grid-cols-3 gap-4 shadow-lg  rounded-lg p-4  shadow-md  '
            style={{ borderRadius: "1rem",   zIndex: 99 , width:"90%", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} >
            <div className='ion-text-center'> 
              <p style={{lineHeight:"1.5em"}} >
                <small className='text-dark'>ต้นทางรถอก</small>  <br/>
                <IonLabel className='text-2xl ' ><strong>{trip.time}</strong></IonLabel> <br/>
                <IonLabel className='text-sm text-meduim' >{trip.departure}</IonLabel>
              </p>
            </div>
            
            <div className='flex flex-column justify-center items-center' > 
              <small>{trip.duration}</small>
              
            </div>
            <div className='ion-text-center'>
              <p style={{lineHeight:"1.5em"}} >
                <small className='text-dark text-xs'>ปลายทาง</small>  <br/>
                <IonLabel className='text-2xl ' ><strong>{trip.arrive}</strong></IonLabel> <br/>
                <IonLabel className='text-sm text-meduim' >{trip.destination}</IonLabel>
              </p>
            </div>
          </div>
 
        </div>
        {/* <div className="max-w-3xl mx-auto"> 

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold">{trip.title}</div>
                <div className="text-sm text-gray-500">{trip.tripdate} • {trip.time}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">รหัสทริป</div>
                <div className="font-medium">{trip.id}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">รถ: {trip.bus} • ที่นั่ง: {trip.totalPassenger}</div>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonButton expand="block" routerLink={`/plan/${id}`} className="bg-indigo-600">แผนที่ที่นั่ง</IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton expand="block" routerLink={`/ticket/${id}`} className="bg-gray-200 text-gray-800">รายละเอียดตั๋ว</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div> */}
      </IonContent>
    </IonPage>
  );
};

export default TripDetail;
