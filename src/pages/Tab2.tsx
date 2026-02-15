import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import './css/Tab2.css';
import { Html5Qrcode } from 'html5-qrcode';

const Tab2: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (qrRef.current) {
        qrRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startScan = async () => {
    setResult(null);
    try {
      const qr = new Html5Qrcode('reader');
      qrRef.current = qr;
      setScanning(true);
      await qr.start(
        { facingMode: 'environment' } as any,
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          setResult(decodedText);
          qr.stop().then(() => qr.clear()).catch(() => {});
          setScanning(false);
        },
        (errorMessage: any) => {
          // ignore
        }
      );
    } catch (e) {
      console.error(e);
      setScanning(false);
    }
  };

  const stopScan = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
        await qrRef.current.clear();
      } catch (e) {
        // ignore
      }
      qrRef.current = null;
    }
    setScanning(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>สแกน QR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding bg-white min-h-screen">
        <div className="max-w-xl mx-auto">
          <div id="reader" className="w-full bg-black rounded-lg overflow-hidden" style={{ minHeight: 320 }} />
          <div className="mt-4">
            {!scanning ? (
              <IonButton expand="block" onClick={startScan} className="bg-blue-600">เริ่มสแกน</IonButton>
            ) : (
              <IonButton expand="block" color="medium" onClick={stopScan} className="bg-gray-400">หยุดสแกน</IonButton>
            )}
          </div>
          {result && (
            <div className="mt-4 p-3 rounded bg-green-50 border border-green-100">
              <div className="font-semibold">ผลลัพธ์:</div>
              <div className="text-sm text-gray-700 break-words">{result}</div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
