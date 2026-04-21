import { faArrowLeft, faArrowRight, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonButtons, IonIcon, IonText, IonLabel, IonList, IonItem, IonItemOptions, IonItemOption, IonItemSliding, useIonActionSheet, useIonAlert, useIonLoading } from '@ionic/react';
import { color } from 'framer-motion';
import { arrowBackCircleOutline, book, callOutline, chatbubbleEllipses, checkmarkCircleOutline, thumbsUpOutline, thumbsDownOutline, helpCircleOutline } from 'ionicons/icons';
import moment from 'moment';
import { usePhoneCallFlow, CallResult } from '../hooks/usePhoneCallFlow';
import { useIonToast, IonActionSheet } from '@ionic/react';
import React, { use, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BouceAnimation } from '../components/Animations';
import { supabase } from '../supabase/supabase';
import { BookingResponse, Ticket } from '../types/Ticket';
import { checkInSelf, getBookingDetail } from '../https/api';
import QRCode from "qrcode";

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [actionSheet, dimissActionSheet] = useIonActionSheet();
  const [booking, setBooking] = React.useState<BookingResponse | null>(null);
  const [ionalert, dimissIonAlert] = useIonAlert();
  const [iontoast] = useIonToast();
  const [present, dismiss] = useIonLoading();

  const { startCall, showResultSheet, setShowResultSheet, submitCallResult, currentPhone, metadata } = usePhoneCallFlow();

  const calltoCustomer = (phone: string, ticketData: Ticket) => {
    if (!phone) return;
    startCall(phone, ticketData);
  }

  const handlerCall = async (result: string) => {
    const sessionstr = localStorage.getItem("session")
    const session = JSON.parse(sessionstr || "{}")

    try {
      const { error: callCustomerError } = await supabase.from("call_customer").insert({
        booking_id: metadata?.booking_id,
        call_time: moment().format(),
        user_id: session?.user?.id,
        result: result,
        phone_number: currentPhone,
        ticket_number: metadata?.ticket_number
      });

      if (callCustomerError) {
        console.error("Error saving call log:", callCustomerError);
      } else {
        iontoast({
          message: "บันทึกการโทรสำเร็จ",
          duration: 2000,
          color: "success",
          position: "top"
        });
      }
    } catch (err) {
      console.error("Unexpected error in handlerCall:", err);
    }
  }

  const checkInSeat = async (ticket: Ticket) => {
    if (!ticket) return;
    await present({ message: 'กำลังบันทึกข้อมูล...' });
    const checkedAt = moment().format();
    try {
      const qrBookingCode = await QRCode.toDataURL(ticket?.id);
      const rescheckin = await checkInSelf(ticket.ticket_number, qrBookingCode);

      if (rescheckin.error) {
        console.error('Error checking in ticket:', rescheckin.error);
        iontoast({ message: 'เช็คอินไม่สำเร็จ', color: 'danger', duration: 2000 });
        return;
      }

      setBooking((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.map((t: Ticket) => t.id === ticket.id ? { ...t, checked_in_at: checkedAt } : t)
        };
      });

      iontoast({ message: 'เช็คอินสำเร็จ', color: 'success', duration: 2000 });
    } catch (err) {
      console.error('Unexpected error during check-in:', err);
    } finally {
      dismiss();
    }
  }

  const checkInAll = async () => {
    if (!booking?.tickets) return;
    await present({ message: 'กำลังเช็คอินผู้โดยสารทั้งหมด...' });
    const checkedAt = moment().format();
    const ticketIds = booking.tickets.map((t: Ticket) => t.id);

    try {
      booking.tickets.map(async (ticket: Ticket) => {
        const qrBookingCode = await QRCode.toDataURL(ticket?.id);
        const rescheckin = await checkInSelf(ticket.ticket_number, qrBookingCode);
        if (rescheckin.error) {
          console.error('Error checking in ticket:', rescheckin.error);
          iontoast({ message: 'เช็คอิน' + ticket?.passenger_name + 'ไม่สำเร็จ', color: 'danger', duration: 2000, position: "top" })
        } else {
          iontoast({ message: 'เช็คอิน' + ticket?.passenger_name + 'สำเร็จ', color: 'success', duration: 2000, position: "top" })
        }
      })

      setBooking((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.map((t: Ticket) => ({ ...t, checked_in_at: checkedAt }))
        };
      });

      iontoast({ message: 'เช็คอินผู้โดยสารทั้งหมดแล้ว', color: 'success', duration: 2000 });
    } catch (err) {
      console.error('Unexpected error in checkInAll:', err);
    } finally {
      dismiss();
    }
  }

  const actionPassenger = (p: Ticket) => {
    actionSheet({
      header: `ที่นั่ง ${p.seat_number} - ${p.passenger_name}`,
      buttons: [
        {
          text: "โทรติดต่อผู้โดยสาร",
          icon: callOutline,
          handler: () => {
            calltoCustomer(p.passenger_phone, p);
          }
        },
        {
          text: p.checked_in_at ? "เช็คอินแล้ว" : "เช็คอินผู้โดยสาร",
          icon: checkmarkCircleOutline,
          disabled: !!p.checked_in_at,
          handler: () => { checkInSeat(p) }
        },
        { text: "ยกเลิก", role: "cancel" }
      ]
    })
  }

  useEffect(() => {
    const conf = async () => {
      // await present({ message: 'กำลังโหลดข้อมูล...' });
      try {
        const token = localStorage.getItem("session")
        const bookingData: BookingResponse = await getBookingDetail(id)
        console.log("booking: ", bookingData)
        // setBooking(booking)
        // const { data: booking, error: bookingError } = await supabase.from('bookings')
        //   .select(` * `)
        //   .eq('id', id)
        //   .single()
        // if (bookingError) {
        //   console.log(bookingError);
        // }
        // console.log("booking: ", JSON.stringify(booking))
        // if (booking) {
        //   const { data: trip, error: tripError } = await supabase.from('trips')
        //     .select(` * `)
        //     .eq('id', booking.trip_id)
        //     .single()
        //   if (tripError) {
        //     console.log(tripError);
        //   }
        //   if (trip) {
        //     console.log("trip: ", JSON.stringify(trip))
        //     const { data: route, error: routeError } = await supabase.from('routes')
        //       .select(` * `)
        //       .eq('id', trip.route_id)
        //       .single()
        //     if (routeError) {
        //       console.log(routeError);
        //     }
        //     if (route) {
        //       trip.route = route
        //     }

        //     booking.trip = trip
        //   }


        const { data: dataTicket, error: ticketError } = await supabase.from('tickets')
          .select(` * `)
          .eq('booking_id', bookingData.id)
        if (ticketError) {
          console.log(ticketError);
        }
        if (dataTicket) {
          bookingData.tickets = dataTicket

          console.log("succss booking ", bookingData);
          setBooking(bookingData)
        }
        // }
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
      } finally {
        dismiss();
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
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }} >{booking?.origin}</IonLabel>
              </div>
              <div className='col-span-2 ion-text-center flex items-center justify-center ' >
                <FontAwesomeIcon icon={faArrowRight} style={{ fontWeight: "bolder", fontSize: "1.2em", color: "#FFF" }} />
              </div>
              <div className='col-span-5 ion-text-right overflow-hidden'>
                <IonLabel style={{ fontWeight: "bolder", color: "#FFF", fontSize: "1.8rem", whiteSpace: "nowrap", display: "block" }}>{booking?.destination}</IonLabel>
              </div>
            </div>
            <div className='  flex justify-center items-center w-full' >
              <div className='text-light' style={{ width: "10%", color: "white" }}><FontAwesomeIcon icon={faCarSide} /> </div>
              <div style={{ width: "79%", borderWidth: "1px", borderColor: "#FFF" }} className='border-dashed' ></div>
            </div>
            <div className='ion-margin-horizontal ion-text-right ' >
              <IonLabel className='text-light' style={{ fontSize: "0.8em", color: "white" }} >{booking?.date && moment(booking?.date).format('DD MMMM , YYYY')}</IonLabel>
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
                <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{booking?.departureTime}</IonLabel> <br />
                <IonLabel className='text-xs' color={"dark"} >จุดขึ้น  <span className='text-meduim'>{booking?.boardingPoint}</span></IonLabel>
              </div>
              <div className='bg-light-tint ion-padding ion-radius' >
                <IonLabel className='text-xs' color={"dark"} >รถถึงปลายทาง</IonLabel><br />
                <IonLabel className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} >{booking?.arrivalTime}</IonLabel> <br />
                <IonLabel className='text-xs' color={"dark"} >จุดลง  <span className='text-meduim'>{booking?.dropOffPoint}</span></IonLabel>
              </div>
              <div className='col-span-2 bg-light-tint ion-padding ion-radius' >
                {
                  booking?.passengers.map((p) =>
                    <IonLabel key={p.seatNumber} className='text-2xl' color={"dark"} style={{ fontWeight: 600 }} > {p.seatNumber} </IonLabel>
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
                const phone = booking?.passengers[0]?.phone;
                if (phone) calltoCustomer(phone, booking?.tickets?.[0]);
              }}
            >
              <IonText color={"primary"} > โทรติดต่อผู้โดยสาร: {booking?.passengers[0]?.phone}</IonText>
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
                  booking?.passengers.map((p) =>
                    <IonItem key={p.seatNumber} className='  ion-text-wrap' onClick={() => {
                      // Map passenger to a ticket for the action sheet
                      const ticket = booking.tickets.find(t => t.seat_number === p.seatNumber);
                      if (ticket) actionPassenger(ticket);
                    }} >
                      <IonLabel>
                        <IonText className='ion-margin-end'>ที่นั่ง {p.seatNumber}</IonText> <IonText> ชื่อ {p.fullName}</IonText> <br />
                        หมายเลขโทรศัพท์  {p.phone}
                      </IonLabel>
                    </IonItem>
                  )
                }
              </IonList>
            </div>
          </BouceAnimation>

          <div className='bottom-div' >
            <IonButton expand='block' mode='ios' className=" text-light rounded-4xl" style={{ color: "#FFF" }}
              onClick={checkInAll}
              disabled={booking?.tickets.every((t: Ticket) => !!t.checked_in_at)}
            >
              เช็คอินผู้โดยสารทั้งหมด
            </IonButton>
          </div>
        </div>
        <div style={{ height: "7rem" }} ></div>


      </IonContent>
      <IonActionSheet
        isOpen={showResultSheet}
        onDidDismiss={() => setShowResultSheet(false)}
        header={`สรุปผลการติดต่อ (${currentPhone})`}
        subHeader="กรุณาเลือกผลการสนทนาที่เกิดขึ้น"
        buttons={[
          {
            text: 'สำเร็จ (Successful)',
            icon: thumbsUpOutline,
            handler: () => {
              handlerCall("successful");
              submitCallResult('successful');
            },
          },
          {
            text: 'ไม่มีผู้รับสาย (No response)',
            icon: helpCircleOutline,
            handler: () => {
              handlerCall("no_reponse");
              submitCallResult('no response');
            },
          },
          {
            text: 'ลูกค้าปฏิเสธ (Customer deny)',
            icon: thumbsDownOutline,
            handler: () => {
              handlerCall("customer_deny");
              submitCallResult('customer deny');
            },
          },
          {
            text: 'บันทึกภายหลัง',
            role: 'cancel',
          },
        ]}
      />
    </IonPage>
  );
};

export default TicketDetail;
