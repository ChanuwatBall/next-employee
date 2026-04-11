import { faArrowLeft, faArrowRight, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonButtons, IonIcon, IonText, IonLabel, IonList, IonItem, IonItemOptions, IonItemOption, IonItemSliding, useIonActionSheet, useIonAlert } from '@ionic/react';
import { color } from 'framer-motion';
import { arrowBackCircleOutline, book, callOutline, chatbubbleEllipses, checkmarkCircleOutline } from 'ionicons/icons';
import moment from 'moment';
import React, { use, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BouceAnimation } from '../components/Animations';
import { getBookingDetail } from '../https/api';
import { supabase } from '../supabase/supabase';
import { Booking } from '../types/Booking';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [actionSheet, dimissActionSheet] = useIonActionSheet();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [ionalert, dimissIonAlert] = useIonAlert();

  // const ticket = {
  //   id: "OGHTROHTRJHO",
  //   trip: {
  //     id: '1',
  //     title: 'โคราช - กทม.',
  //     time: '07:20',
  //     arrive: '09:40',
  //     tripdate: "2024-06-20",
  //     isOnBoard: true,
  //     departure: "โคราช",
  //     destination: "กรุงเทพฯ",
  //     duration: "2 ชม. 20 นาที",
  //     facilities: "WiFi, ปลั๊กชาร์จ, ผ้าห่ม, น้ำดื่ม, ขนม",
  //   },
  //   passengers: [
  //     { id: '1', name: 'นายสมชาย ใจดี', seat: '1A', status: 'onboard', phone: "08x-xxx-xxxx" },
  //     { id: '2', name: 'นางสาวสมหญิง แสนดี', seat: '1B', status: 'onboard', phone: "08x-xxx-xxxx" },
  //     { id: '3', name: 'นายสมปอง ดีใจ', seat: '2A', status: 'onboard', phone: "08x-xxx-xxxx" },
  //   ],
  //   upLocation: "ช่องจำหน่ายตั๋ว 58",
  //   downLocation: "โลตัสปากช่อง",
  //   code: "TICKET12345",
  // }

  const actionPassenger = (p: any) => {
    actionSheet({
      header: `ที่นั่ง ${p.seat_number} - ${p.passenger_name}`,
      buttons: [
        { text: "โทรติดต่อผู้โดยสาร", icon: callOutline, handler: () => { window.open(`tel:${p.passenger_phone}`) } },
        { text: "ส่งข้อความถึงผู้โดยสาร", icon: chatbubbleEllipses, handler: () => { window.open(`sms:${p.passenger_phonephone}`) } },
        { text: "เช็คอินผู้โดยสาร", icon: checkmarkCircleOutline, handler: () => { } },
        { text: "ยกเลิก", role: "cancel" }
      ]
    })
  }

  useEffect(() => {
    const conf = async () => {
      try {
        console.log("bookingReference paaram id: ", id)
        const { data: booking, error: bookingError } = await supabase.from('bookings')
          .select(` * `)
          .eq('booking_reference', id)
          .single()
        if (bookingError) {
          console.log(bookingError);
        }
        console.log("booking: ", JSON.stringify(booking))
        if (booking) {
          const { data: trip, error: tripError } = await supabase.from('trips')
            .select(` * `)
            .eq('id', booking.trip_id)
            .single()
          if (tripError) {
            console.log(tripError);
          }
          if (trip) {
            console.log("trip: ", JSON.stringify(trip))
            const { data: route, error: routeError } = await supabase.from('routes')
              .select(` * `)
              .eq('id', trip.route_id)
              .single()
            if (routeError) {
              console.log(routeError);
            }
            if (route) {
              trip.route = route
            }

            booking.trip = trip
          }


          const { data: dataTicket, error: ticketError } = await supabase.from('tickets')
            .select(` * `)
            .eq('booking_id', booking.id)
          if (ticketError) {
            console.log(ticketError);
          }
          if (dataTicket) {
            console.log(" dataTicket ", JSON.stringify(dataTicket));
            booking.tickets = dataTicket

            console.log("succss booking ", booking);
            setBooking(booking)
          }
        }
      } catch (e) {
        console.log("error: ", JSON.stringify(e))
        ionalert({
          header: 'ไม่พบข้อมูลตั๋ว',
          message: 'QR ที่สแกนไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง , ' + JSON.stringify(e),
          buttons: [
            {
              text: 'ตกลง',
              role: "cancel",
              handler: () => {
                dimissIonAlert();
                history.goBack();
              }
            }
          ]
        })
      }
    }
    conf()
  }, [])

  return (
    <IonPage>
      <IonHeader className="ion-no-border" mode='md'>
        <IonToolbar className='on-text-center ' color={"primary"} >
          {/* <IonButtons slot="start">
            <IonButton style={{color:"#FFF"}} onClick={() => { history.goBack() }} >
              <IonIcon icon={arrowBackCircleOutline}  />
            </IonButton>
          </IonButtons>
          <IonLabel className="text-md font-semibold" style={{color:"#FFF"}} >รายละเอียดตั๋ว</IonLabel> */}
          <IonToolbar className='ion-no-padding' color={"primary"}>
            <div className="grid grid-rows-1 ion-padding-horizontal ion-padding-top bg-primary text-white  ">
              <div>
                <IonButton fill='clear' style={{ color: "#FFF" }} onClick={() => { history.goBack() }} >
                  <FontAwesomeIcon icon={faArrowLeft} />  &nbsp;&nbsp;
                  <IonText  >รายละเอียดตั๋ว</IonText>
                </IonButton>
              </div>

            </div>
          </IonToolbar>
        </IonToolbar>
      </IonHeader>
      <IonContent color={"light"} className="ion-no-padding min-h-screen" style={{ position: "relative" }} >
        <BouceAnimation duration={0.4} delay={0.2}  >
          {/* <div className="grid grid-rows-2   ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
            style={{ borderBottomLeftRadius: "3rem", borderBottomRightRadius: "3rem", paddingBottom: "4rem" }}>

            <div className='grid grid-cols-3  text-light ion-margin-horizontal ' style={{ gap: 2 }} >
              <div>
                <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em", color: "white" }} >{booking?.trip?.route?.origin}</IonLabel>
              </div>
              <div className='ion-text-center flex items-center justify-center ' >
                <FontAwesomeIcon icon={faArrowRight} className='text-white' style={{ fontWeight: "bolder", fontSize: "1.2em", color: "white" }} />
              </div>
              <div className='ion-text-right'>
                <IonLabel style={{ fontWeight: "bolder", fontSize: "1.7em", color: "white" }}>{booking?.trip?.route?.destination}</IonLabel>
              </div>
            </div>
            <div className='  flex justify-center items-center w-full' >
              <div className='text-light' style={{ width: "10%", color: "white" }}><FontAwesomeIcon icon={faCarSide} /> </div>
              <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
            </div>
            <div className='ion-margin-horizontal ion-text-right ' >
              <IonLabel className='text-light' style={{ fontSize: "0.8em", color: "white" }} >{booking?.trip?.date && moment(booking.trip.date).format('DD MMMM , YYYY')}</IonLabel>
            </div>
          </div> */}
          <div className="grid grid-rows-2   ion-padding-horizontal ion-padding-top bg-primary text-white  ion-padding-bottom  "
            style={{ borderBottomLeftRadius: "3rem", borderBottomRightRadius: "3rem", paddingBottom: "4rem" }} >

            <div className='grid grid-cols-12 gap-2 text-light ion-margin-horizontal items-center' >
              <div className='col-span-5 overflow-hidden'>
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }} >{booking?.trip?.route?.origin}</IonLabel>
              </div>
              <div className='col-span-2 ion-text-center flex items-center justify-center ' >
                <FontAwesomeIcon icon={faArrowRight} style={{ fontWeight: "bolder", fontSize: "1.2em", color: "#FFF" }} />
              </div>
              <div className='col-span-5 ion-text-right overflow-hidden'>
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }}>{booking?.trip?.route?.destination}</IonLabel>
              </div>
            </div>
            <div className='  flex justify-center items-center w-full' >
              <div className='text-light' style={{ width: "10%", color: "white" }}><FontAwesomeIcon icon={faCarSide} /> </div>
              <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
            </div>
            <div className='ion-margin-horizontal ion-text-right ' >
              <IonLabel className='text-light' style={{ fontSize: "0.8em", color: "white" }} >{booking?.trip?.date && moment(booking?.trip?.date).format('DD MMMM , YYYY')}</IonLabel>
            </div>
          </div>
        </BouceAnimation>


        <div style={{ width: "100%", marginTop: "-2rem", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: " 15vh", }}
          className='flex flex-column items-center justify-center '
        >
          <BouceAnimation duration={0.4} delay={0.3} >
            <div className='bg-white grid grid-cols-2 gap-4  ion-padding'
              style={{ borderRadius: "1rem", zIndex: 99, width: " 90vw", maxWidth: "720px", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", gap: "0.5rem" }} >
              <div className='bg-light-tint ion-padding ion-radius' >
                <IonLabel className='text-xs ' color={"dark"} >รถออกจากต้นทาง</IonLabel><br />
                <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{booking?.trip?.departure_time}</IonLabel> <br />
                <IonLabel className='text-xs' color={"dark"} >จุดขึ้น  <span className='text-meduim'>{booking?.pickup_stop}</span></IonLabel>
              </div>
              <div className='bg-light-tint ion-padding ion-radius' >
                <IonLabel className='text-xs' color={"dark"} >รถถึงปลายทาง</IonLabel><br />
                <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{booking?.trip?.arrival_time}</IonLabel> <br />
                <IonLabel className='text-xs' color={"dark"} >จุดลง  <span className='text-meduim'>{booking?.dropoff_stop}</span></IonLabel>
              </div>
              <div className='col-span-2 bg-light-tint ion-padding ion-radius' >
                {
                  booking?.tickets.map((p: any) =>
                    <IonLabel key={p.id} className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} > {p.seat_number} </IonLabel>
                  )
                }
                <br /> <IonLabel className='text-xs text-meduim' color={"dark"} >ที่นั่งของผู้โดยสาร</IonLabel>
              </div>
            </div>
          </BouceAnimation>
          <br />
          <BouceAnimation duration={0.4} delay={0.5} >
            <button className='bg-transparent  ion-padding border-light-tint'
              style={{
                borderRadius: "1rem", zIndex: 99, width: "90vw", maxWidth: "720px", fontSize: "1.2em",
                borderWidth: "1px", borderStyle: "dashed", borderColor: "var(--ion-color-primary)"
              }}
              onClick={() => {
                window.open(`tel:${booking?.phone}`, '_system');
              }}
            >
              <IonText color={"primary"} > โทรติดต่อผู้โดยสาร: {booking?.phone}</IonText>
            </button>
          </BouceAnimation><br />
          <BouceAnimation duration={0.4} delay={0.5} >
            <div className='bg-white  ion-padding border-light-tint'
              style={{
                borderRadius: "1rem", zIndex: 99, width: "90vw", maxWidth: "720px",
                borderWidth: "1px", borderStyle: "solid",
              }} >

              <IonList>
                {
                  booking?.tickets.map((p: any) =>
                    <IonItem key={p.id} className='  ion-text-wrap' onClick={() => { actionPassenger(p) }} >
                      <IonLabel>
                        <IonText className='ion-margin-end'>ที่นั่ง {p.seat_number}</IonText> <IonText> ชื่อ {p.passenger_name}</IonText> <br />
                        หมายเลขโทรศัพท์  {p.passenger_phone}
                      </IonLabel>
                    </IonItem>
                  )
                }
              </IonList>
            </div>
          </BouceAnimation>

          <div className='bottom-div' >
            <IonButton expand='block' mode='ios' className=" text-light rounded-4xl" style={{ color: "#FFF" }}
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
