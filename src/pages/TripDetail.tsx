import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp, faCarSide, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonText, IonBackButton, IonLabel, IonIcon, IonChip, IonAccordion, IonAccordionGroup, IonBadge, IonModal, IonItem, IonInput, IonList, IonLoading, IonToast, IonTextarea, IonRefresher, IonRefresherContent } from '@ionic/react';
import { speedometerOutline, batteryChargingOutline, documentTextOutline } from 'ionicons/icons';
import moment, { duration } from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './css/TripDetail.css';
import { BouceAnimation } from '../components/Animations';
import { supabase } from '../supabase/supabase';

import { Trip } from '../types/trip';
import { getTripSeats, updateDriverLocation, startShift, stopShift } from '../https/api';
import { getDriverTripPassengers } from '../http/api';
import { Geolocation } from '@capacitor/geolocation';
import { ForegroundService, ServiceType } from '@capawesome-team/capacitor-android-foreground-service';
import { Capacitor } from '@capacitor/core';
import TripDetailSkeleton from '../components/TripDetailSkeleton';

interface TripData {
  id: string;
  bus_number: string;
  date: string;
  departure_time: string;
  arrival_time: string;
  route_id: any;
  bus_type_id: string;
  bus_type: any;
  bus_stops: any[];
  vehicle_id?: string;
}

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [stationacc, setStationAcc] = React.useState<string>("");
  const [trip, setTrip] = React.useState<TripData | null>(null);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [startFormData, setStartFormData] = useState({
    start_km: 0,
    start_mileage: 0,
    start_battery: 100
  });

  const [watchId, setWatchId] = useState<string | null>(null);

  const [stopFormData, setStopFormData] = useState({
    stop_km: 0,
    stop_mileage: 0,
    stop_battery: 0,
    notes: ""
  });

  const handleStartShift = async () => {
    try {
      setLoading(true);
      const payload = {
        trip_id: id,
        vehicle_id: null,
        ...startFormData
      };

      await startShift(payload);

      // Save active shift status to localStorage
      localStorage.setItem('active_shift_id', id);

      setShowStartModal(false);
      setToastMsg("เริ่มเที่ยวสำเร็จ");
      setShowToast(true);

      // Start Tracking
      startTracking();
    } catch (error) {
      console.error(error);
      setToastMsg("เกิดข้อผิดพลาดในการเริ่มเที่ยว");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStopShift = async () => {
    try {
      setLoading(true);

      const payload = {
        ...stopFormData
      };

      await stopShift(payload);
      
      // Clear active shift status
      localStorage.removeItem('active_shift_id');

      setShowStopModal(false);
      setToastMsg("จบเที่ยวสำเร็จ");
      setShowToast(true);

      // Stop Tracking
      stopTracking();
    } catch (error) {
      console.error(error);
      setToastMsg("เกิดข้อผิดพลาดในการจบเที่ยว");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      if (Capacitor.getPlatform() === 'android') {
        await ForegroundService.requestPermissions().catch(console.error);
        await ForegroundService.createNotificationChannel({
          id: "service_channel",
          name: "ระบบติดตามเที่ยวรถ",
          description: "ใช้สำหรับการแจ้งเตือนเมื่อกำลังอยู่ในกะ",
          importance: 3
        }).catch(console.error);

        await ForegroundService.startForegroundService({
          id: 12345,
          title: "กำลังอยู่ในกะ",
          body: "ระบบติดตามพิกัดรถกำลังทำงานในเบื้องหลัง",
          smallIcon: "ic_launcher_foreground",
          notificationChannelId: "service_channel",
          serviceType: ServiceType.Location,
        }).catch((er) => {
          console.log("ForegroundService error ", JSON.stringify(er))
        })
      }

      const id = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      }, (position, err) => {
        if (position) {
          console.log("position ", JSON.stringify(position));
          updateDriverLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed_kmh: (position.coords.speed || 0) * 3.6,
            heading_deg: position.coords.heading || 0
          }).catch(console.error);
        }
      });
      setWatchId(id);
    } catch (error) {
      console.error("Tracking error:", JSON.stringify(error));
    }
  };

  const stopTracking = async () => {
    try {
      if (watchId) {
        await Geolocation.clearWatch({ id: watchId });
        setWatchId(null);
      }
      if (Capacitor.getPlatform() === 'android') {
        await ForegroundService.stopForegroundService();
        await ForegroundService.deleteNotificationChannel({
          id: 'service_channel',
        });
      }
    } catch (error) {
      console.error("Stop tracking error:", error);
    }
  };

  const getTrip = async () => {

    const sessionstr = localStorage.getItem("session")
    const session = JSON.parse(sessionstr || "{}")
    const passengers: any[] = await getDriverTripPassengers(id, session.access_token)
    console.log("passengers ", passengers)

    const { data, error } = await supabase.from('trips')
      .select('*, route_id(*)')
      .eq('id', id)
      .single();
    console.log("trips data ", data);
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log("trips data ", data);

      const { data: busStops, error: busStopsError } = await supabase.from('bus_stops')
        .select('*')
        .eq('route_id', data.route_id.id)
      if (busStopsError) {
        throw busStopsError
      }
      console.log("busStops ", busStops);

      for (const bsp of busStops) {
        const onBoardTickets = passengers.filter((p: any) => p.pickupStop === bsp.name);
        const offBoardTickets = passengers.filter((p: any) => p.dropoffStop === bsp.name);

        bsp.passengerOnboard = onBoardTickets.length;
        bsp.passengerOffboard = offBoardTickets.length;
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
  if (!trip) {
    return <TripDetailSkeleton />;
  }

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
        <IonRefresher slot="fixed" onIonRefresh={(e) => getTrip().then(() => e.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>
        <div>
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
                <IonText className='text-xs' color={"medium"} > ทะเบียนรถ : {trip?.bus_number} {trip?.bus_type?.name}</IonText> <br />
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

            <BouceAnimation className=" card-stations  bg-white"
              duration={0.4} delay={0.5}  >
              <IonAccordionGroup className=' ion-margin  bg-white' value={stationacc}  >
                {trip.bus_stops?.map((station) => (
                  <StationTrip key={station.id} station={station} />
                ))}
              </IonAccordionGroup>
            </BouceAnimation>
          </div>
          <div className='bottom-div ion-padding-horizontal' >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <IonButton expand='block' mode='ios' color="success" className="rounded-xl" onClick={() => setShowStartModal(true)}>
                เริ่มเที่ยว
              </IonButton>
              <IonButton expand='block' mode='ios' color="danger" className="rounded-xl" onClick={() => setShowStopModal(true)}>
                จบเที่ยว
              </IonButton>
            </div>
            <IonButton expand='block' mode='ios' className="text-light rounded-4xl" style={{ color: "#FFF" }}
              onClick={() => { history.push("/plan/" + trip?.id) }} >
              ที่นั่งทั้งหมด
            </IonButton>
          </div>
          <div style={{ height: "15rem" }} ></div>

          {/* Start Shift Modal */}
          <IonModal className="custom-modal" isOpen={showStartModal} onDidDismiss={() => setShowStartModal(false)} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.8]}>
            <IonHeader className="ion-no-border">
              <IonToolbar color="success">
                <IonTitle>เริ่มเที่ยวรถ</IonTitle>
                <div slot="end" className="ion-padding-end">
                  <IonButton fill="clear" color="light" onClick={() => setShowStartModal(false)}>ปิด</IonButton>
                </div>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList className="form-list" lines="none">
                <IonItem className="modern-input-item">
                  <IonIcon icon={speedometerOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number" label="เลขไมล์เริ่มต้น (Start KM)"
                    value={startFormData.start_km} labelPlacement="stacked"
                    onIonInput={(e) => setStartFormData({ ...startFormData, start_km: Number(e.detail.value) })}
                    placeholder="เลขไมล์เริ่มต้น (Start KM)"
                    className="modern-input"
                  />
                </IonItem>
                <IonItem className="modern-input-item">
                  <IonIcon icon={speedometerOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number" labelPlacement="stacked" label='เลขระยะทางเริ่มต้น'
                    value={startFormData.start_mileage}
                    onIonInput={(e) => setStartFormData({ ...startFormData, start_mileage: Number(e.detail.value) })}
                    placeholder="เลขระยะทางเริ่มต้น (Start Mileage)"
                    className="modern-input"
                  />
                </IonItem>
                <IonItem className="modern-input-item">
                  <IonIcon icon={batteryChargingOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number"
                    value={startFormData.start_battery} labelPlacement="stacked" label='ระดับแบตเตอรี่ (%)'
                    onIonInput={(e) => setStartFormData({ ...startFormData, start_battery: Number(e.detail.value) })}
                    placeholder="ระดับแบตเตอรี่ (%)"
                    className="modern-input"
                  />
                </IonItem>
              </IonList>
              <div className="ion-padding-top">
                <IonButton expand="block" color="success" mode="ios" className="login-button" style={{ '--background': 'var(--ion-color-success)' }} onClick={handleStartShift}>
                  ยืนยันเริ่มเที่ยว
                </IonButton>
              </div>
            </IonContent>
          </IonModal>

          {/* Stop Shift Modal */}
          <IonModal className="custom-modal" isOpen={showStopModal} onDidDismiss={() => setShowStopModal(false)} initialBreakpoint={0.6} breakpoints={[0, 0.6, 0.9]}>
            <IonHeader className="ion-no-border">
              <IonToolbar color="danger">
                <IonTitle>จบเที่ยวรถ</IonTitle>
                <div slot="end" className="ion-padding-end">
                  <IonButton fill="clear" color="light" onClick={() => setShowStopModal(false)}>ปิด</IonButton>
                </div>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList className="form-list" lines="none">
                <IonItem className="modern-input-item">
                  <IonIcon icon={speedometerOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number" label="เลขไมล์สิ้นสุด (Stop KM)" labelPlacement="stacked"
                    value={stopFormData.stop_km}
                    onIonInput={(e) => setStopFormData({ ...stopFormData, stop_km: Number(e.detail.value) })}
                    placeholder="เลขไมล์สิ้นสุด (Stop KM)"
                    className="modern-input"
                  />
                </IonItem>
                <IonItem className="modern-input-item">
                  <IonIcon icon={speedometerOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number" label="เลขระยะทางสิ้นสุด (Stop Mileage)" labelPlacement="stacked"
                    value={stopFormData.stop_mileage}
                    onIonInput={(e) => setStopFormData({ ...stopFormData, stop_mileage: Number(e.detail.value) })}
                    placeholder="เลขระยะทางสิ้นสุด (Stop Mileage)"
                    className="modern-input"
                  />
                </IonItem>
                <IonItem className="modern-input-item">
                  <IonIcon icon={batteryChargingOutline} slot="start" className="input-icon" />
                  <IonInput
                    type="number" label="ระดับแบตเตอรี่สิ้นสุด (%)" labelPlacement="stacked"
                    value={stopFormData.stop_battery}
                    onIonInput={(e) => setStopFormData({ ...stopFormData, stop_battery: Number(e.detail.value) })}
                    placeholder="ระดับแบตเตอรี่สิ้นสุด (%)"
                    className="modern-input"
                  />
                </IonItem>
                <IonItem className="modern-input-item">
                  <IonIcon icon={documentTextOutline} slot="start" className="input-icon" />
                  <IonTextarea
                    label="หมายเหตุ (Notes)" labelPlacement="stacked"
                    value={stopFormData.notes}
                    onIonInput={(e) => setStopFormData({ ...stopFormData, notes: e.detail.value || "" })}
                    placeholder="Enter"
                    className="modern-input"
                  />
                </IonItem>
              </IonList>
              <div className="ion-padding-top">
                <IonButton expand="block" color="danger" mode="ios" className="login-button" style={{ '--background': 'var(--ion-color-danger)' }} onClick={handleStopShift}>
                  ยืนยันจบเที่ยว
                </IonButton>
              </div>
            </IonContent>
          </IonModal>

          <IonLoading isOpen={loading} message="กำลังบันทึกข้อมูล..." />
          <IonToast isOpen={showToast} message={toastMsg} duration={2000} onDidDismiss={() => setShowToast(false)} />
        </div>
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
          {/* <IonLabel className='text-xs text-meduim' >เวลา {station.time}</IonLabel> */}
        </div>
        <div className='col-span-3 ion-text-right'>
          <IonBadge color={"success"} className='text-sm' mode='ios' >
            <IonText color={"light"}> {station.passengerOnboard}</IonText>
          </IonBadge> &nbsp;
          <IonBadge color={"danger"} className='text-sm' mode='ios' >
            <IonText> {station.passengerOffboard}</IonText>
          </IonBadge>
          {/* <IonChip color={"tertiary"} >
            <IonLabel className='text-2xs text-dark' >
              <FontAwesomeIcon icon={faArrowUp} className='text-dark' />
              {station.passengerOnboard}
            </IonLabel>&nbsp;
            <IonLabel className='text-2xs text-dark' >
              <FontAwesomeIcon icon={faArrowDown} className='text-dark' />
              {station.passengerOffboard}  </IonLabel>
          </IonChip> */}
        </div>
      </div>
      <div slot='content' className='ion-padding' >
        <IonText className='text-sm text-meduim' color={"dark"} >
          <FontAwesomeIcon icon={faArrowUp} />   ผู้โดยสารที่ขึ้นสถานี นี้ : &nbsp;
          <IonBadge color={"success"} className='text-sm' mode='ios' >
            <IonText color={"light"}> {station.passengerOnboard} คน </IonText>
          </IonBadge> <br />
          <FontAwesomeIcon icon={faArrowDown} />   ผู้โดยสารที่ลงสถานี นี้ : &nbsp;
          <IonBadge color={"danger"} className='text-sm' mode='ios' >
            <IonText color={"light"}> {station.passengerOffboard} คน </IonText>
          </IonBadge>  <br />
        </IonText>
      </div>
    </IonAccordion>
  );
}