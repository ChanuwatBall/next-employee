import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState } from 'react';

const Sigin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<'driver' | 'busconductor'>('driver');

    const doLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username || '');
        localStorage.setItem('role', role);
        window.location.href = '/home';
    };

    return (
        <IonPage>
            <IonContent className="ion-padding flex items-center justify-center bg-white min-h-screen">
                <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-50">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">เข้าสู่ระบบ</h2>
                    <IonItem className="mb-3 bg-white rounded">
                        <IonLabel position="stacked">ชื่อผู้ใช้</IonLabel>
                        <IonInput value={username} onIonChange={e => setUsername(String(e.detail.value || ''))} className="text-base" />
                    </IonItem>
                    <IonItem className="mb-4 bg-white rounded">
                        <IonLabel position="stacked">สิทธิ</IonLabel>
                        <IonSelect value={role} onIonChange={e => setRole(e.detail.value)}>
                            <IonSelectOption value="driver">พนักงานขับรถ (Driver)</IonSelectOption>
                            <IonSelectOption value="busconductor">พนักงานตรวจตั๋ว (Conductor)</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <div className="mt-2">
                        <IonButton expand="block" onClick={doLogin} className="bg-blue-600">เข้าสู่ระบบ</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Sigin;