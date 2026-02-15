import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonModal } from '@ionic/react';

type Seat = {
  id: string;
  row: number;
  col: number;
  status: 'available' | 'booked' | 'selected' | 'unavailable';
  label?: string;
};

const createSeats = (rows: number, cols: number): Seat[] => {
  const seats: Seat[] = [];
  let id = 1;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({ id: `${id}`, row: r, col: c, status: Math.random() > 0.8 ? 'booked' : 'available', label: `${r}${String.fromCharCode(64 + c)}` });
      id++;
    }
  }
  return seats;
};

const PlanChair: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>(() => createSeats(10, 4));
  const [selected, setSelected] = useState<Seat | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSeatClick = (s: Seat) => {
    if (s.status === 'booked' || s.status === 'unavailable') return;
    setSelected(s);
    setShowModal(true);
  };

  const toggleSelect = () => {
    if (!selected) return;
    setSeats(prev => prev.map(p => (p.id === selected.id ? { ...p, status: p.status === 'selected' ? 'available' : 'selected' } : p)));
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>แผนที่ที่นั่ง</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="mb-3 text-sm text-gray-600">แสดงตำแหน่งที่นั่งบนรถ ตามรูปแบบใน mockup</div>

          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-3/4 h-10 bg-gray-200 rounded-md flex items-center justify-center">ทางเดิน</div>
            </div>

            <IonGrid>
              {Array.from({ length: 10 }).map((_, rIdx) => (
                <IonRow key={rIdx} className="flex items-center mb-2">
                  {Array.from({ length: 4 }).map((_, cIdx) => {
                    const seat = seats[rIdx * 4 + cIdx];
                    return (
                      <IonCol key={cIdx} className="ion-text-center">
                        <button
                          onClick={() => handleSeatClick(seat)}
                          className={`w-12 h-12 rounded-md flex items-center justify-center text-xs font-medium
                            ${seat.status === 'booked' ? 'bg-red-400 text-white cursor-not-allowed' : ''}
                            ${seat.status === 'available' ? 'bg-white border border-gray-300 text-gray-800' : ''}
                            ${seat.status === 'selected' ? 'bg-indigo-600 text-white' : ''}`}
                        >
                          {seat.label}
                        </button>
                      </IonCol>
                    );
                  })}
                </IonRow>
              ))}
            </IonGrid>
          </div>

          <div className="mt-4 flex gap-3">
            <IonButton className="bg-indigo-600" expand="block">ยืนยันที่นั่ง</IonButton>
            <IonButton className="bg-gray-200 text-gray-800" expand="block">ยกเลิก</IonButton>
          </div>
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">รายละเอียดที่นั่ง</h3>
            {selected && (
              <div>
                <div className="mb-2">ที่นั่ง: <span className="font-medium">{selected.label}</span></div>
                <div className="mb-4">สถานะ: <span className="font-medium">{selected.status}</span></div>
                <div className="flex gap-2">
                  <IonButton onClick={toggleSelect} className="bg-indigo-600">{selected.status === 'selected' ? 'ยกเลิกเลือก' : 'เลือกที่นั่ง'}</IonButton>
                  <IonButton color="medium" onClick={() => setShowModal(false)}>ปิด</IonButton>
                </div>
              </div>
            )}
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default PlanChair;
