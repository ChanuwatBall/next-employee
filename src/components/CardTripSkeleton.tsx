import React from 'react';
import { IonSkeletonText } from '@ionic/react';
import "./css/CardTrip.css";

const CardTripSkeleton: React.FC = () => {
  return (
    <div className="card-trip modern skeleton-card" style={{ paddingBottom: "10px", marginBottom: "16px" }}>
      <div className="trip-main-info" style={{ margin: "0 0 .3rem", padding: "1em" }}>
        {/* Top bar: Title skeleton */}
        <div className="flex justify-between items-center mb-3">
          <div className="bus-tag bg-gray-50 px-2 py-1 rounded-lg flex items-center" style={{ width: '60%' }}>
            <IonSkeletonText animated style={{ width: '100%', height: '20px', borderRadius: '8px' }} />
          </div>
        </div>

        {/* Subheader: Bus info and Badge skeleton */}
        <div className="flex items-center mb-4">
          <IonSkeletonText animated style={{ width: '30%', height: '16px', marginRight: '10px' }} />
          <IonSkeletonText animated style={{ width: '20%', height: '16px', borderRadius: '12px' }} />
        </div>

        {/* Route visualization skeleton */}
        <div className="route-visual flex items-center gap-4 mb-4" style={{ padding: '0 10px' }}>
          <div className="time-col text-center" style={{ flex: '0 0 50px' }}>
            <IonSkeletonText animated style={{ width: '100%', height: '24px', marginBottom: '4px' }} />
            <IonSkeletonText animated style={{ width: '60%', height: '10px', margin: '0 auto' }} />
          </div>

          <div className="path-col flex-grow flex items-center gap-1">
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1f5f9' }}></div>
             <IonSkeletonText animated style={{ flexGrow: 1, height: '2px' }} />
             <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#f1f5f9' }}></div>
             <IonSkeletonText animated style={{ flexGrow: 1, height: '2px' }} />
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1f5f9' }}></div>
          </div>

          <div className="time-col text-center" style={{ flex: '0 0 50px' }}>
            <IonSkeletonText animated style={{ width: '100%', height: '24px', marginBottom: '4px' }} />
            <IonSkeletonText animated style={{ width: '60%', height: '10px', margin: '0 auto' }} />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="trip-footer flex justify-between items-end" style={{ padding: "10px 0 5px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ width: '40%' }}>
            <IonSkeletonText animated style={{ width: '100%', height: '12px' }} />
          </div>
          <div style={{ width: '20%' }}>
            <IonSkeletonText animated style={{ width: '100%', height: '16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTripSkeleton;
