import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
} from "@ionic/react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

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

  const stop = async () => {
    try {
      await BarcodeScanner.stopScan();
    } catch {}
    setScanningUi(false);
    setScanning(false);
  };

  const start = async () => {
    scannedOnce.current = false;

    const perm = await BarcodeScanner.requestPermissions();
    if (perm.camera !== "granted") return;

    setScanningUi(true);
    setScanning(true);

    const sub = await BarcodeScanner.addListener("barcodesScanned", async (event) => {
      if (scannedOnce.current) return;
      const code = event.barcodes?.[0]?.rawValue;
      if (!code) return;

      scannedOnce.current = true;
      await stop();
      alert(code);
    });

    // await BarcodeScanner.startScan({ formats: ["QR_CODE"] });

    return () => sub.remove();
  };

  useEffect(() => {
    let cleanup: any;

    (async () => {
      cleanup = await start();
    })();

    return () => {
      if (cleanup) cleanup();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage className={scanning ? "scanning" : ""}>
      <IonHeader className={scanning ? "scanning" : ""}>
        <IonToolbar className={scanning ? "scanning" : ""}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>สแกน QR ตั๋ว</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={scanning ? "scanning" : ""}>
        {scanning && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 260,
                height: 260,
                transform: "translate(-50%, -50%)",
                border: "3px solid #e11d48",
                borderRadius: 24,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
              }}
            />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ScanQrPage;
