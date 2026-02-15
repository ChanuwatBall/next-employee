import { IonContent, IonHeader, IonList, IonListHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonButton } from '@ionic/react';
import React from 'react';
import { Link } from 'react-router-dom';

const mockTrips = [
  { id: '1', title: 'Trip A - Bangkok to Chiang Mai', time: '08:00' },
  { id: '2', title: 'Trip B - Bangkok to Pattaya', time: '10:30' }
];

const Trips: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ทริปของฉัน</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-white min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-3">รายการทริป</h3>
          <div className="space-y-3">
            {mockTrips.map(t => (
              <Link key={t.id} to={`/trip/${t.id}`} className="block">
                <div className="p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.time}</div>
                    </div>
                    <div className="text-sm text-gray-400">รายละเอียด</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Trips;
