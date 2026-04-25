import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBusSide, faClipboardList, faQrcode } from '@fortawesome/free-solid-svg-icons';
import './css/CustomTabBar.css';

const CustomTabBar: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const tabs = [
        { id: 'home', path: '/home', label: 'หน้าแรก', icon: faHouse },
        { id: 'trip', path: '/trips', label: 'เที่ยวรถ', icon: faBusSide },
        { id: 'scan', path: '/scanQrPage', label: 'สแกน', icon: faQrcode, isFab: true },
        { id: 'history', path: '/shift-history', label: 'ประวัติ', icon: faClipboardList },
        { id: 'profile', path: '/profile', label: 'โปรไฟล์', icon: faUser },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Hide Tab Bar if current path is not in the tabs list
    const isTabPath = tabs.some(tab => tab.path === location.pathname);
    if (!isTabPath) return null;

    return (
        <div className="custom-tab-bar-container">
            <nav className="custom-tab-bar">
                {tabs.map((tab) => (
                    <div 
                        key={tab.id} 
                        className={`tab-item ${isActive(tab.path) ? 'active' : ''} ${tab.isFab ? 'fab-item' : ''}`}
                        onClick={() => history.push(tab.path)}
                    >
                        <div className="tab-icon-wrapper">
                            <FontAwesomeIcon icon={tab.icon} />
                        </div>
                        {!tab.isFab && <span className="tab-label">{tab.label}</span>}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default CustomTabBar;
