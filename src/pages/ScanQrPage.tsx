import React, { useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  useIonViewDidEnter,
  useIonViewWillLeave,
  useIonAlert,
  IonButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import "./css/ScanQrPage.css";
import { arrowBackCircleOutline, ticket } from "ionicons/icons";
import { useHistory } from "react-router";

const setScanningUi = (on: boolean) => {
  const html = document.documentElement;
  const body = document.body;
  const app = document.querySelector("ion-app");
  const tabbar = document.querySelector("ion-tab-bar");

  if (on) {
    html.classList.add("scanning");
    body.classList.add("scanning");
    app?.classList.add("scanning");
    tabbar?.classList.add("scanning");
  } else {
    html.classList.remove("scanning");
    body.classList.remove("scanning");
    app?.classList.remove("scanning");
    tabbar?.classList.remove("scanning");
  }
};

const ScanQrPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const scannedOnce = useRef(false);
  const listenerRef = useRef<any>(null);
  const history = useHistory();
  const [ionalert , dimissIonAlert] = useIonAlert();

  const stop = async () => {
    try {
      await BarcodeScanner.stopScan();
    } catch {}
    if (listenerRef.current) {
      try {
        listenerRef.current.remove();
      } catch {}
      listenerRef.current = null;
    }
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    setScanningUi(false);
    setScanning(false);
  };

  const getResult = async (val:any) => {
     const valueQrCode = val.split("#")
    if(valueQrCode[0].indexOf("nex-ticket.com") > -1){
      const ticketId = valueQrCode[1];
      return {
        result: true ,
        ticketId:  ticketId ,
        ticketUrl: `https://nex-ticket.com/ticket/${ticketId}`
      }
    }else{
      return {
        result: false
      }
    }
  }
  const start = async () => {
    scannedOnce.current = false;

    const perm = await BarcodeScanner.requestPermissions();
    if (perm.camera !== "granted") return;

    setScanningUi(true);
    setScanning(true);
    document.querySelector('body')?.classList.add('barcode-scanner-active');

    try {
      await BarcodeScanner.startScan();
    } catch (e) {
      setScanningUi(false);
      setScanning(false);
      return;
    }

    listenerRef.current = await BarcodeScanner.addListener("barcodesScanned", async (event) => {
      if (scannedOnce.current) return;
      const code = event.barcodes?.[0]?.rawValue;
      if (!code) return;
      scannedOnce.current = true;
      const res = await getResult(code);
      if(res.result){
        history.push(`/ticket/${res.ticketId}`);
        await stop();
      }else{ 
        ionalert({
          header: 'ไม่พบข้อมูลตั๋ว',
          message: 'QR ที่สแกนไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
          buttons: [
            {
              text: 'ตกลง',
              role:"cancel",
              handler: () => {
                dimissIonAlert();
              }
            }
          ]
        })
      }
      // await stop();
      // alert(code);
    });
  };

  useIonViewDidEnter(() => {
    start();
  });

  useIonViewWillLeave(() => {
    stop();
  });

  return (
    <IonPage className={scanning ? "scanning " : ""}>
      <IonHeader mode="md" className={scanning ? "scanning ion-no-border" : "ion-no-border"}>
        <IonToolbar className={scanning ? "scanning" : ""}>
          <IonButtons slot="start">
             <IonButton color="dark" onClick={() =>{ history.goBack()}} >
              <IonIcon icon={arrowBackCircleOutline} /> &nbsp;&nbsp;&nbsp;&nbsp;
              <IonText className="text-lg">สแกน QR ตั๋ว</IonText>
             </IonButton>
          </IonButtons> 
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={scanning ? "scanning" : ""}>
        {scanning && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div
              className="scan-frame" 
            />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ScanQrPage;
