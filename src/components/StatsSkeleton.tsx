import React from 'react';
import { IonSkeletonText } from '@ionic/react';
import "../pages/css/Home.css";

const StatsSkeleton: React.FC = () => {
    return (
        <div className="stats-dashboard grid grid-cols-2" style={{ gap: 10 }}>
            <div className="stat-card glass shadow-sm">
                <div className="stat-label larger">
                    <IonSkeletonText animated style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="stat-value larger">
                    <IonSkeletonText animated style={{ width: '80%', height: '32px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="stat-progress">
                    <IonSkeletonText animated style={{ width: '100%', height: '6px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
            </div>
            <div className="stat-card glass shadow-sm">
                <div className="stat-label larger">
                    <IonSkeletonText animated style={{ width: '60%', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="stat-value larger">
                    <IonSkeletonText animated style={{ width: '80%', height: '32px', background: 'rgba(255,255,255,0.2)' }} />
                </div>
            </div>
        </div>
    );
};

export default StatsSkeleton;
