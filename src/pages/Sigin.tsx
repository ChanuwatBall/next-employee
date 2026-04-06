import { IonButton, IonCheckbox, IonContent, IonImg, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState, useEffect } from 'react';
import "./css/Signin.css"
import { supabase } from "../supabase/supabase";

const Sigin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false);
    // const [role, setRole] = useState<'driver' | 'busconductor'>('driver');

    useEffect(() => {
        const savedUsername = localStorage.getItem('savedUsername');
        const savedPassword = localStorage.getItem('savedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedRememberMe) {
            if (savedUsername) setUsername(savedUsername);
            if (savedPassword) setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const doLogin = async () => {
        console.log("username ", username)
        console.log("password ", password)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        })
        if (error) {
            console.log(error)
        } else {
            console.log("data ", data)
            let role = data.user.role?.toString() || '';
            localStorage.setItem('isAuthenticated', "true");
            localStorage.setItem('username', username || '');
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('session', JSON.stringify(data.session));

            if (rememberMe) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
                localStorage.setItem('rememberMe', 'false');
            }

            window.location.href = '/home';
        }
    };

    return (
        <IonPage>
            <IonContent className=" flex items-center justify-center bg-white min-h-screen">
                <div
                    className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-50 ion-padding"
                    style={{ backgroundImage: 'url(../assets/svg/bus-seat.svg)', backgroundSize: 'cover', backgroundPosition: 'center', height: "100%" }}
                >

                    <div className="grid  ion-padding"><br /><br /><br /><br />
                        <div className="logo-section w-full flex items-center" style={{ flexDirection: "column", marginBottom: "3rem" }} >
                            <IonImg src="../assets/svg/logo.svg" style={{ width: "30vw", maxWidth: "200px" }} /> <br />
                            <span className="text-sm font-semibold text-gray-800 " style={{ color: "black" }}> เข้าสู่ระบบเพื่อจัดการเที่ยวการเดินทาง</span>
                        </div>
                        <div className="ion-margin-top">
                            <IonLabel style={{ color: "black" }}>อีเมลล์ หรือยูเซอร์เนม</IonLabel>
                            <IonInput
                                value={username}
                                placeholder="ีuser@gmail.com"
                                className="signin-input"
                                mode="ios"
                                onIonChange={e =>
                                    setUsername(String(e.detail.value || ''))}
                            ></IonInput>
                        </div><br />
                        <div >
                            <IonLabel style={{ color: "black" }}>รหัสผ่าน</IonLabel>
                            <IonInput
                                value={password}
                                type="password"
                                placeholder="****"
                                className="signin-input"
                                mode="ios"
                                onIonChange={e =>
                                    setPassword(String(e.detail.value || ''))}
                            >
                                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle></IonInput>
                        </div><br />
                        <div className="flex items-center gap-2">
                            <IonCheckbox
                                checked={rememberMe}
                                onIonChange={e => setRememberMe(e.detail.checked)}
                                mode="ios"
                            />
                            <IonLabel style={{ color: "black", marginLeft: ".5rem" }}>จดจำฉันไว้</IonLabel>
                        </div><br />
                        <div className="mt-2">
                            <IonButton expand="block" mode="ios" onClick={doLogin} className="bg-blue-600">
                                <span style={{ color: "white" }} >เข้าสู่ระบบ</span>
                            </IonButton>
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Sigin;