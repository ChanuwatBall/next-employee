import { IonButton, IonCheckbox, IonContent, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage } from "@ionic/react";
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
    menu: base => ({
        ...base,
        zIndex: 9999,
        backgroundColor: '#1c1c1e', // Dark background for the menu
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? '#3a3a3c'
            : isFocused
                ? '#2c2c2e'
                : '#1c1c1e',
        color: '#ffffff',
        cursor: 'pointer',
        ':active': {
            backgroundColor: '#3a3a3c',
        },
    }),
    control: base => ({
        ...base,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
    }),
    singleValue: base => ({
        ...base,
        color: '#000000', // Keep single value black if the background is still light
    }),
    input: base => ({
        ...base,
        color: '#000000',
    }),
    placeholder: base => ({
        ...base,
        color: '#9ca3af',
    })
};

const DRIVER_PHONE_OPTIONS = [
    '0997874156',
    '0812345678',
    '0865552211',
];
type Driver = {
    id: string
    name: string
    license_number: string
    phone: string
    is_active: boolean,
    created_at: string,
    email: string | null,
    password_hash: string | null
}
const Sigin: React.FC = () => {
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driver, setDriver] = useState<Driver | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const menuPortalTarget = typeof window !== 'undefined' ? document.body : null;

    const driverOptions: SelectOption[] = drivers.map(driver => ({
        value: driver.id,
        label: driver.name,
    }));

    const phoneOptions: SelectOption[] = DRIVER_PHONE_OPTIONS.map(option => ({
        value: option,
        label: option,
    }));

    useEffect(() => {
        const savedPhone = localStorage.getItem('savedDriverPhone');
        const savedLicenseNumber = localStorage.getItem('savedLicenseNumber');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        setRememberMe(savedRememberMe);
        if (savedRememberMe) {
            if (savedPhone) setPhone(savedPhone);
            if (savedLicenseNumber) setLicenseNumber(savedLicenseNumber);
        }

        const conf = async () => {
            const { data: dlist, error } = await supabase.from('drivers').select('*');
            if (error) {
                console.error("Error fetching drivers:", error);
                return;
            }

            console.log("drivers", dlist);
            setDrivers(dlist || []);

            // If we have a saved phone, try to find and set the driver object
            if (savedRememberMe && savedPhone) {
                const foundDriver = (dlist || []).find((d: Driver) => d.phone === savedPhone);
                if (foundDriver) {
                    setDriver(foundDriver);
                }
            }
        }
        conf();
    }, []);

    const doLogin = async () => {
        try {
            const body = {
                phone: phone,
                licenseNumber: licenseNumber
            }

            const loginres: { token: string, driver: any } = await driverLogin(body)
            console.log("loginres", loginres);

            if (rememberMe) {
                localStorage.setItem('savedDriverPhone', phone);
                localStorage.setItem('savedLicenseNumber', licenseNumber);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('savedDriverPhone');
                localStorage.removeItem('savedLicenseNumber');
                localStorage.setItem('rememberMe', 'false');
            }

            localStorage.setItem('isAuthenticated', "true");
            localStorage.setItem('role', 'driver');
            if (loginres?.token) {
                localStorage.setItem('session',
                    JSON.stringify({ access_token: loginres?.token, expires_in: moment().add(1, 'hour').format(), driver: loginres?.driver }));
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
                            <IonItem className="signin-item" lines="none" style={{ borderBottom: "1px solid #e9e8e8" }} >
                                <IonLabel position="stacked" className="signin-label  " style={{ marginLeft: ".5rem", marginBottom: ".5rem" }} > <small>เลือกผู้ขับขี่</small> </IonLabel>
                                <Select
                                    className="signin-react-select"
                                    classNamePrefix="signin-input"
                                    options={driverOptions}
                                    value={driverOptions.find(option => option.value === driver?.id) || null}
                                    onChange={selected => {
                                        const foundDriver = drivers.find(d => d.id === selected?.value) || null;
                                        setDriver(foundDriver);
                                        if (foundDriver) {
                                            setPhone(foundDriver.phone);
                                            setLicenseNumber(foundDriver.license_number);
                                        }
                                    }}
                                    isSearchable
                                    placeholder="เลือกผู้ขับขี่"
                                    menuPortalTarget={menuPortalTarget}
                                    menuPosition="fixed"
                                    styles={selectMenuStyles}
                                />
                            </IonItem>
                            <IonItem lines="none" style={{ borderBottom: "1px solid #DDD" }} >
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
                            <IonItem lines="none"  >
                                <IonInput
                                    value={licenseNumber} label-placement="stacked"
                                    type="text" label="หมายเลขใบขับขี่"
                                    placeholder="DL-000-000"
                                    mode="ios" className="signin-ion-input"
                                    onIonChange={e => setLicenseNumber(String(e.detail.value || ''))}
                                ></IonInput>
                            </IonItem>
                        </IonList>
                        <IonItem lines="none" color={"transparent"} className="remember-me-item">
                            <IonCheckbox
                                slot="start"
                                checked={rememberMe}
                                onIonChange={e => setRememberMe(e.detail.checked)}
                                mode="ios"
                            />
                            <IonLabel>จดจำฉันในระบบ</IonLabel>
                        </IonItem><br />

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