import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';

type SessionUser = {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
};

type ProfileData = {
  avatar?: string;
  name: string;
  employeeCode: string;
  username: string;
  position: string;
  role: string;
  // Add more fields as needed
};
const Profile: React.FC = () => {
  const [profile, setProfile] = useState<SessionUser | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const user = session.driver as SessionUser | undefined;
        if (user) {
          setProfile(user );
        }
      } catch (error) {
        console.error("Error parsing session:", error);
      }
    }
    console.log("profile ", profile);
  }, []);

  const doLogout = () => {
    localStorage.removeItem('session');
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
          <IonButtons slot="start">
            <IonBackButton color={"dark"} defaultHref="/home" />
          </IonButtons>
          <IonTitle>โปรไฟล์</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={true} className="ion-padding bg-white min-h-screen">
        <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">

          <div className='avatar-container ion-margin-bottom'>
            {/* <img src={profile?.avatar} alt="Avatar" className=" avatarimg " /> */}
            {/* <IonButton fill="clear" color="primary" onClick={() => alert('เปลี่ยนรูปโปรไฟล์')}>
              <IonIcon icon={createOutline} />
            </IonButton> */}
          </div>

          <div className="grid grid-cols-3 ion-padding ion-margin-bottom">
            <div className="font-medium text-gray-600 text-bold-500 flex items-center">ชื่อ-สกุล:</div>
            <div className="col-span-2 line-bottom-dashed">{profile?.name }</div>

            <div className="font-medium text-gray-600 text-bold-500 flex items-center">รหัสพนักงาน:</div>
            <div className="col-span-2 line-bottom-dashed ">{profile?.id &&  profile?.id.substring(0,10).toLocaleUpperCase() || '-'}</div>

            <div className="font-medium text-gray-600 text-bold-500 flex items-center">ใบขับขี่:</div>
            <div className="col-span-2 line-bottom-dashed ">{profile?.licenseNumber || '-'}</div>

            <div className="font-medium text-gray-600 text-bold-500 flex items-center">เบอร์โทร:</div>
            <div className="col-span-2 line-bottom-dashed ">{profile?.phone || '-'}</div>
{/* 
            <div className="font-medium text-gray-600 text-bold-500 flex items-center">บทบาท:</div>
            <div className="col-span-2 line-bottom-dashed ">{profile?.role || '-'}</div> */}
          </div>

          <br />
          <div className="ion-margin-top">
            <IonButton expand="block" color="danger" onClick={doLogout} className="bg-red-500">ออกจากระบบ</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
