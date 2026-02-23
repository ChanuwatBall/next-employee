import { IonButton, IonContent, IonImg, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState } from 'react';
import "./css/Signin.css"

const Sigin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password ,setPassword]= useState("")
    const [role, setRole] = useState<'driver' | 'busconductor'>('driver');

    const doLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username || '');
        localStorage.setItem('role', "busconductor");
        window.location.href = '/home';
    };

    return (
        <IonPage>
            <IonContent className="ion-padding flex items-center justify-center bg-white min-h-screen">
                <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-50   ">
                    
                    <div className="grid grid-rows-5 ion-padding">
                        <div className="logo-section w-full flex items-center" style={{flexDirection:"column",marginBottom:"3rem"}} >
                            <IonImg src="../assets/svg/logo.svg"  style={{width:"30vw" , maxWidth:"200px"}} /> <br/>
                            <span className="text-sm font-semibold text-gray-800 "> เข้าสู่ระบบเพื่อจัดการเที่ยวการเดินทาง</span>
                        </div> 
                        <div className="ion-margin-top">
                            <IonLabel>Username</IonLabel>
                            <IonInput 
                             value={username} 
                             className="signin-input"
                             onIonChange={e => 
                             setUsername(String(e.detail.value || ''))} 
                            ></IonInput> 
                        </div>
                         <div >
                            <IonLabel>Password</IonLabel>
                            <IonInput 
                             value={password} 
                             type="password"
                             className="signin-input"
                             onIonChange={e => 
                             setPassword(String(e.detail.value || ''))} 
                            >
                                 <IonInputPasswordToggle slot="end"></IonInputPasswordToggle></IonInput> 
                        </div>
                        <div className="mt-2">
                            <IonButton expand="block" mode="ios" onClick={doLogin} className="bg-blue-600">เข้าสู่ระบบ</IonButton>
                        </div> 

                    </div> 
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Sigin;