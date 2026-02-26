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
            <IonContent className=" flex items-center justify-center bg-white min-h-screen">
                <div 
                    className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-50 ion-padding" 
                    style={{ backgroundImage: 'url(../assets/svg/bus-seat.svg)', backgroundSize: 'cover', backgroundPosition: 'center',height:"100%" }} 
                >
                    
                    <div className="grid  ion-padding"><br/><br/><br/><br/>
                        <div className="logo-section w-full flex items-center" style={{flexDirection:"column",marginBottom:"3rem"}} >
                            <IonImg src="../assets/svg/logo.svg"  style={{width:"30vw" , maxWidth:"200px"}} /> <br/>
                            <span className="text-sm font-semibold text-gray-800 " style={{color:"black"}}> เข้าสู่ระบบเพื่อจัดการเที่ยวการเดินทาง</span>
                        </div> 
                        <div className="ion-margin-top">
                            <IonLabel style={{color:"black"}}>Username</IonLabel>
                            <IonInput 
                             value={username} 
                             placeholder="Username"
                             className="signin-input"
                             onIonChange={e => 
                             setUsername(String(e.detail.value || ''))} 
                            ></IonInput> 
                        </div><br/>
                         <div >
                            <IonLabel style={{color:"black"}}>Password</IonLabel>
                            <IonInput 
                             value={password} 
                             type="password"
                             placeholder="Password"
                             className="signin-input"
                             onIonChange={e => 
                             setPassword(String(e.detail.value || ''))} 
                            >
                                 <IonInputPasswordToggle slot="end"></IonInputPasswordToggle></IonInput> 
                        </div><br/><br/>
                        <div className="mt-2">
                            <IonButton expand="block" mode="ios" onClick={doLogin} className="bg-blue-600">
                                <span  style={{color:"white"}} >เข้าสู่ระบบ</span>
                            </IonButton>
                        </div> 

                    </div> 
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Sigin;