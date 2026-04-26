import React from 'react';
import { IonSkeletonText } from '@ionic/react';
import "../pages/css/ShiftHistory.css";

const ActivityItemSkeleton: React.FC = () => {
    return (
        <div className="activity-item ion-margin-bottom">
            <div className="activity-header">
                <div className="activity-info-group">
                    <div className="activity-icon-container" style={{ background: '#f1f5f9' }}>
                        <IonSkeletonText animated style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div className="activity-meta">
                        <div className="activity-date">
                            <IonSkeletonText animated style={{ width: '120px', height: '20px' }} />
                        </div>
                        <div className="activity-time-range">
                            <IonSkeletonText animated style={{ width: '140px', height: '14px' }} />
                        </div>
                    </div>
                </div>
                <div className="activity-earning-group text-right">
                    <IonSkeletonText animated style={{ width: '60px', height: '24px', borderRadius: '6px', marginLeft: 'auto' }} />
                </div>
            </div>

            <div className="activity-stats-grid">
                <div className="stat-box">
                    <span className="stat-box-label">
                        <IonSkeletonText animated style={{ width: '30px', height: '10px', margin: '0 auto' }} />
                    </span>
                    <span className="stat-box-value">
                        <IonSkeletonText animated style={{ width: '40px', height: '14px', margin: '0 auto' }} />
                    </span>
                </div>
                <div className="stat-box">
                    <span className="stat-box-label">
                        <IonSkeletonText animated style={{ width: '40px', height: '10px', margin: '0 auto' }} />
                    </span>
                    <span className="stat-box-value">
                        <IonSkeletonText animated style={{ width: '60px', height: '14px', margin: '0 auto' }} />
                    </span>
                </div>
                <div className="stat-box">
                    <span className="stat-box-label">
                        <IonSkeletonText animated style={{ width: '40px', height: '10px', margin: '0 auto' }} />
                    </span>
                    <span className="stat-box-value">
                        <IonSkeletonText animated style={{ width: '50px', height: '14px', margin: '0 auto' }} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ActivityItemSkeleton;
