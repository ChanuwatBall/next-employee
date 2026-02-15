import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Tab3.css';

const Tab3: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
  }, []);

  const doLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('driver_elapsed');
    window.location.href = '/signin';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>โปรไฟล์</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding bg-white min-h-screen">
        <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="mb-3">
            <h2 className="text-xl font-semibold">โปรไฟล์พนักงาน</h2>
          </div>
          <div className="mb-2"><span className="font-medium">ชื่อ: </span>{username || '-'}</div>
          <div className="mb-4"><span className="font-medium">ตำแหน่ง: </span>{role || '-'}</div>
          <div className="mt-4">
            <IonButton expand="block" color="danger" onClick={doLogout} className="bg-red-500">ออกจากระบบ</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
