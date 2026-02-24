import { faArrowRight, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonButtons, IonIcon, IonText, IonLabel, IonList, IonItem, IonItemOptions, IonItemOption, IonItemSliding } from '@ionic/react';
import { color } from 'framer-motion';
import { arrowBackCircleOutline } from 'ionicons/icons';
import moment from 'moment';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BouceAnimation } from '../components/Animations';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const ticket = {
    id: "OGHTROHTRJHO",
    trip: {
      id: '1',
      title: 'โคราช - กทม.',
      time: '07:20',
      arrive: '09:40',
      tripdate: "2024-06-20",
      isOnBoard: true,
      departure: "โคราช",
      destination: "กรุงเทพฯ",
      duration: "2 ชม. 20 นาที",
      facilities: "WiFi, ปลั๊กชาร์จ, ผ้าห่ม, น้ำดื่ม, ขนม",
    },
    passengers: [
      { id: '1', name: 'นายสมชาย ใจดี', seat: '1A', status: 'onboard', phone: "08x-xxx-xxxx" },
      { id: '2', name: 'นางสาวสมหญิง แสนดี', seat: '1B', status: 'onboard', phone: "08x-xxx-xxxx" },
      { id: '3', name: 'นายสมปอง ดีใจ', seat: '2A', status: 'onboard', phone: "08x-xxx-xxxx" },
    ],
    upLocation: "ช่องจำหน่ายตั๋ว 58",
    downLocation: "โลตัสปากช่อง",
    code: "TICKET12345",
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border" mode='md'>
        <IonToolbar className='on-text-center ' color={"primary"} >
          <IonButtons slot="start">
            <IonButton style={{color:"#FFF"}} onClick={() => { history.goBack() }} >
              <IonIcon icon={arrowBackCircleOutline}  />
            </IonButton>
          </IonButtons>
          <IonLabel className="text-md font-semibold" style={{color:"#FFF"}} >รายละเอียดตั๋ว</IonLabel>
        </IonToolbar>
      </IonHeader>
      <IonContent color={"light"} className="ion-no-padding min-h-screen" style={{ position: "relative" }} >
        <BouceAnimation duration={0.4} delay={0.2} className="grid grid-rows-2   ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
          style={{ borderBottomLeftRadius: "3rem", borderBottomRightRadius: "3rem", paddingBottom: "4rem" }} >

          <div className='grid grid-cols-3 gap-2 text-light ion-margin-horizontal ' >
            <div>
              <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em" , color:"white" }} >{ticket.trip.departure}</IonLabel>
            </div>
            <div className='ion-text-center flex items-center justify-center ' >
              <FontAwesomeIcon icon={faArrowRight} className='text-white' style={{ fontWeight: "bolder", fontSize: "1.2em" , color:"white"}} />
            </div>
            <div className='ion-text-right'>
              <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em" , color:"white"}}>{ticket.trip.destination}</IonLabel>
            </div>
          </div>
          <div className='  flex justify-center items-center w-full' >
            <div className='text-light' style={{ width: "10%" , color:"white"}}><FontAwesomeIcon icon={faCarSide} /> </div>
            <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
          </div>
          <div className='ion-margin-horizontal ion-text-right ' >
            <IonLabel className='text-light' style={{ fontSize: "0.8em", color:"white" }} >{ticket.trip.tripdate && moment(ticket.trip.tripdate).format('DD MMMM , YYYY')}</IonLabel>
          </div>
        </BouceAnimation>
        <div style={{ width: "100%", marginTop: "-2rem", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: " 15vh", }}
          className='flex flex-column items-center justify-center '
        >
          <BouceAnimation duration={0.4} delay={0.3} className='bg-white grid grid-cols-2 gap-4  ion-padding'
            style={{ borderRadius: "1rem", zIndex: 99, width: "90%", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", gap: "0.5rem" }} >
            <div className='bg-light-tint ion-padding ion-radius' >
              <IonLabel className='text-xs ' color={"dark"} >รถออกจากต้นทาง</IonLabel><br />
              <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{ticket.trip.time}</IonLabel> <br />
              <IonLabel className='text-xs' color={"dark"} >จุดขึ้น  <span className='text-meduim'>{ticket.upLocation}</span></IonLabel>
            </div>
            <div className='bg-light-tint ion-padding ion-radius' >
              <IonLabel className='text-xs' color={"dark"} >รถถึงปลายทาง</IonLabel><br />
              <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{ticket.trip.arrive}</IonLabel> <br />
              <IonLabel className='text-xs' color={"dark"} >จุดลง  <span className='text-meduim'>{ticket.downLocation}</span></IonLabel>
            </div>
            <div className='col-span-2 bg-light-tint ion-padding ion-radius' >
              {
                ticket.passengers.map(p =>
                  <IonLabel key={p.id} className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} > {p.seat} </IonLabel>
                )
              }
              <br /> <IonLabel className='text-xs text-meduim' color={"dark"} >ที่นั่งของผู้โดยสาร</IonLabel>
            </div>
          </BouceAnimation>
          <br />
          <BouceAnimation duration={0.4} delay={0.5} className='bg-white  ion-padding border-light-tint'
            style={{
              borderRadius: "1rem", zIndex: 99, width: "90%",
              borderWidth: "1px", borderStyle: "solid",  
            }} >
            <IonList>
              {
                ticket.passengers.map(p =>
                  <IonItemSliding key={p.id}  >
                    <IonItem key={p.id} className='  ion-text-wrap' >
                      <IonLabel>
                        <IonText className='ion-margin-end'>ที่นั่ง {p.seat}</IonText> <IonText> ชื่อ {p.name}</IonText> <br />
                        หมายเลขโทรศัพท์  {p.phone}
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption>
                        <IonLabel color={"dark"}>
                          เช็คอินผู้โดยสาร
                        </IonLabel>
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                )
              }
            </IonList>
          </BouceAnimation>

          <div className='bottom-div' >
            <IonButton expand='block' mode='ios' className=" text-light rounded-4xl" style={{color:"#FFF"}}
            >
              เช็คอินผู้โดยสารทั้งหมด
            </IonButton>
          </div>
        </div>
        <div style={{ height: "7rem" }} ></div>


      </IonContent>
    </IonPage>
  );
};

export default TicketDetail;
