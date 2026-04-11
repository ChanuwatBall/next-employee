import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonActionSheet,
  IonNote
} from '@ionic/react';
import { usePhoneCallFlow } from '../hooks/usePhoneCallFlow';
import { thumbsUpOutline, thumbsDownOutline, helpCircleOutline } from 'ionicons/icons';

const CallExample: React.FC = () => {
  const { 
    startCall, 
    showResultSheet, 
    setShowResultSheet, 
    submitCallResult, 
    currentPhone,
    callResult 
  } = usePhoneCallFlow();

  const customers = [
    { name: 'John Doe', phone: '0812345678' },
    { name: 'Jane Smith', phone: '0898765432' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Call Flow Example</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {customers.map((c, i) => (
            <IonItem key={i}>
              <IonLabel>
                <h2>{c.name}</h2>
                <p>{c.phone}</p>
              </IonLabel>
              <IonButton slot="end" onClick={() => startCall(c.phone)}>
                Call
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {callResult && (
          <div className="ion-margin-top ion-padding" style={{ background: '#f4f4f4', borderRadius: '8px' }}>
            <IonNote color="primary">Last Call Result for {currentPhone}:</IonNote>
            <h3 style={{ margin: '4px 0' }}>{callResult.toUpperCase()}</h3>
          </div>
        )}

        {/* The Action Sheet that triggers when user returns from a call */}
        <IonActionSheet
          isOpen={showResultSheet}
          onDidDismiss={() => setShowResultSheet(false)}
          header={`บันทึกผลการโทร (${currentPhone})`}
          buttons={[
            {
              text: 'สำเร็จ (Successful)',
              icon: thumbsUpOutline,
              handler: () => submitCallResult('successful'),
            },
            {
              text: 'ไม่มีผู้ตอบรับ (No Response)',
              icon: helpCircleOutline,
              handler: () => submitCallResult('no response'),
            },
            {
              text: 'ลูกค้าปฏิเสธ (Customer Deny)',
              icon: thumbsDownOutline,
              handler: () => submitCallResult('customer deny'),
            },
            {
              text: 'ทำภายหลัง',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default CallExample;
