import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const ticket = { id, passenger: 'John Doe', seat: '5A', status: 'active', price: 250 };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายละเอียดตั๋ว</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-md mb-4">
            <img src="/nex UI/ticker-detail.jpg" alt="ticket" className="w-full object-cover h-40" />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="text-lg font-semibold mb-2">ตั๋วของ {ticket.passenger}</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>รหัสตั๋ว: <span className="font-medium">{ticket.id}</span></div>
              <div>ที่นั่ง: <span className="font-medium">{ticket.seat}</span></div>
              <div>สถานะ: <span className="font-medium">{ticket.status}</span></div>
              <div>ราคา: <span className="font-medium">{ticket.price}฿</span></div>
            </div>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonButton expand="block" routerLink="/trips" className="bg-gray-200 text-gray-800">กลับ</IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton expand="block" className="bg-indigo-600">แชร์</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TicketDetail;
