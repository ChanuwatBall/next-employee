import { IonButton, IonContent, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage } from "@ionic/react";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import "./css/Signin.css";
import { driverLogin } from "../http/api";
import { supabase } from "../supabase/supabase";
import moment from "moment";

interface DriverLoginResponse {
    token?: string;
    accessToken?: string;
    access_token?: string;
    driver?: unknown;
    user?: unknown;
    [key: string]: unknown;
}

interface SelectOption {
    value: string;
    label: string;
}

const selectMenuStyles: StylesConfig<SelectOption, false> = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({ ...base, zIndex: 9999 }),
};

const DRIVER_PHONE_OPTIONS = [
    '0997874156',
    '0812345678',
    '0865552211',
];
  type Driver = {
    id:  string
    name:string
    license_number: string
    phone: string
    is_active: boolean,
    created_at: string,
    email: string | null,
    password_hash: string | null
}
const Sigin: React.FC = () => {
    const [phone, setPhone] = useState(DRIVER_PHONE_OPTIONS[0]);
    const [licenseNumber, setLicenseNumber] = useState("");
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const menuPortalTarget = typeof window !== 'undefined' ? document.body : null;

    const driverOptions: SelectOption[] = drivers.map(driver => ({
        value: driver.phone,
        label: driver.name,
    }));

    const phoneOptions: SelectOption[] = DRIVER_PHONE_OPTIONS.map(option => ({
        value: option,
        label: option,
    }));

    useEffect(() => {
        const savedPhone = localStorage.getItem('savedDriverPhone');
        const savedLicenseNumber = localStorage.getItem('savedLicenseNumber');

        if (savedPhone && DRIVER_PHONE_OPTIONS.includes(savedPhone)) setPhone(savedPhone);
        if (savedLicenseNumber) setLicenseNumber(savedLicenseNumber);

        const conf=async () =>{
            const dlist = await supabase.from('drivers').select('*').then(({ data, error }) => {
                if (error) {
                    console.error("Error fetching drivers:", error);
                    return [];
                }
                return data;
            });

            console.log("drivers", dlist);
            setDrivers(dlist);
        }
        conf();
    }, []);

    const doLogin = async () => {
        try {
            const body ={
                phone: phone,
                licenseNumber: licenseNumber
            } 

            const loginres:{token:string , driver:any} = await driverLogin(body)
            console.log("loginres", loginres);
            localStorage.setItem('isAuthenticated', "true");
            localStorage.setItem('role', 'driver');
           if (loginres?.token) {
                localStorage.setItem('session', 
                    JSON.stringify({ access_token: loginres?.token , expires_in: moment().add(1, 'hour').format() , driver: loginres?.driver }));
                window.location.href = '/home';
            } else {
                localStorage.removeItem('session');
            }
        } catch (error) {
            console.error("Login error:", error);
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
                        <IonList className="form-input-sigin" >
                            <IonItem className="signin-item" lines="none" style={{borderBottom:"1px solid #e9e8e8"}} >  
                                <IonLabel position="stacked" className="signin-label ion-margin-start" > <small>เลือกผู้ขับขี่</small> </IonLabel>
                                <Select 
                                    className="signin-react-select"
                                    classNamePrefix="signin-input"
                                    options={driverOptions}
                                    value={driverOptions.find(option => option.value === phone) || null}
                                    onChange={selected => setPhone(selected?.value || DRIVER_PHONE_OPTIONS[0])}
                                    isSearchable
                                    placeholder="เลือกผู้ขับขี่"
                                    menuPortalTarget={menuPortalTarget}
                                    menuPosition="fixed"
                                    styles={selectMenuStyles}
                                />  
                            </IonItem>
                            <IonItem  lines="none" style={{borderBottom:"1px solid #DDD"}} >  
                                <IonInput
                                    value={phone}
                                    type="text" label="เบอร์โทร" 
                                    placeholder="00-000-0000"
                                    label-placement="stacked" 
                                    mode="ios" className="signin-ion-input"
                                    onIonChange={e =>
                                        setPhone(String(e.detail.value || ''))}
                                ></IonInput>
                            </IonItem>
                            <IonItem   lines="none"  >  
                                <IonInput
                                    value={licenseNumber}  label-placement="stacked"
                                    type="text"  label="หมายเลขใบขับขี่" 
                                    placeholder="DL-2025-001" 
                                    mode="ios" className="signin-ion-input"
                                    onIonChange={e => setLicenseNumber(String(e.detail.value || ''))}
                                ></IonInput>
                            </IonItem>
                        </IonList> <br/>

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