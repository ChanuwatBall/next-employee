import React from 'react';
import { IonToolbar, IonSkeletonText } from '@ionic/react';
import "../pages/css/Home.css";

const ActiveShiftSkeleton: React.FC = () => {
    return (
        <div className="active-shift-card" style={{ marginBottom: '20px' }}>
            <IonToolbar color="light" className="active-shift-header" style={{ '--background': '#e2e8f0' }}>
                <div slot="start" className="active-shift-header-content">
                    <IonSkeletonText animated style={{ width: '80px', height: '16px', borderRadius: '4px' }} />
                </div>
            </IonToolbar>
            <div className="active-shift-body">
                <div className="active-shift-info">
                    <div style={{ width: '60%' }}>
                        <IonSkeletonText animated style={{ width: '100%', height: '20px', marginBottom: '8px' }} />
                        <IonSkeletonText animated style={{ width: '60%', height: '14px' }} />
                    </div>
                    <div style={{ width: '80px' }}>
                        <IonSkeletonText animated style={{ width: '100%', height: '30px', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveShiftSkeleton;
