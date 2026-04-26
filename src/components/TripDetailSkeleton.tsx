import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonSkeletonText, IonButton } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../pages/css/TripDetailSkeleton.css';

const TripDetailSkeleton: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <div className="trip-detail-skeleton-header">
            <IonButton fill="clear" style={{ color: "#FFF" }} disabled>
              <FontAwesomeIcon icon={faArrowLeft} /> &nbsp;&nbsp;
              <IonSkeletonText animated style={{ width: '80px', height: '20px' }} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-no-padding">
        <div className="trip-skeleton-hero">
          <div className='hero-grid-skeleton'>
            <div className='hero-col-left'>
              <IonSkeletonText animated style={{ width: '100%', height: '30px', borderRadius: '8px' }} />
            </div>
            <div className='hero-col-center'>
              <div className="circle-skeleton"></div>
            </div>
            <div className='hero-col-right'>
              <IonSkeletonText animated style={{ width: '100%', height: '30px', borderRadius: '8px' }} />
            </div>
          </div>
          <div className='dashed-line-skeleton'></div>
          <div className='ion-text-right' style={{ marginTop: '8px' }}>
            <IonSkeletonText animated style={{ width: '100px', height: '15px', marginLeft: 'auto' }} />
          </div>
        </div>

        <div className='skeleton-content-container'>
          {/* Main Card Skeleton */}
          <div className="card-main-skeleton">
             <div className="card-col-skeleton">
                <IonSkeletonText animated style={{ width: '40px', height: '12px' }} />
                <IonSkeletonText animated style={{ width: '60px', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '50px', height: '12px' }} />
             </div>
             <div className="card-center-skeleton">
                <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
             </div>
             <div className="card-col-skeleton">
                <IonSkeletonText animated style={{ width: '40px', height: '12px' }} />
                <IonSkeletonText animated style={{ width: '60px', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '50px', height: '12px' }} />
             </div>
          </div>

          {/* Bus Info Skeleton */}
          <div className="card-info-skeleton">
             <div className="info-title-skeleton">
               <IonSkeletonText animated style={{ width: '120px', height: '20px' }} />
             </div>
             <IonSkeletonText animated style={{ width: '200px', height: '15px', marginBottom: '8px' }} />
             <IonSkeletonText animated style={{ width: '250px', height: '15px' }} />
          </div>

          {/* List Header */}
          <div className="list-header-skeleton">
            <IonSkeletonText animated style={{ width: '100px', height: '18px' }} />
          </div>

          {/* Stop Items Skeletons */}
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stop-item-skeleton">
              <div className="item-icon-circle"></div>
              <div className="item-text-skeleton">
                <IonSkeletonText animated style={{ width: '60%', height: '18px' }} />
              </div>
              <div className="item-badges-skeleton">
                <div className="badge-mini-skeleton"></div>
                <div className="badge-mini-skeleton"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions Skeleton */}
        <div className="footer-actions-skeleton">
          <div className="action-grid-skeleton">
             <IonSkeletonText animated style={{ width: '100%', height: '44px', borderRadius: '12px' }} />
             <IonSkeletonText animated style={{ width: '100%', height: '44px', borderRadius: '12px' }} />
          </div>
          <IonSkeletonText animated style={{ width: '100%', height: '44px', borderRadius: '32px' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TripDetailSkeleton;
