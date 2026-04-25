import { IonBackButton, IonBadge, IonButtons, IonContent, IonHeader, IonLabel, IonLoading, IonPage, IonText, IonToolbar, IonProgressBar, IonRefresher, IonRefresherContent } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGasPump, faBatteryThreeQuarters, faCircleInfo, faChevronRight, faWallet, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/th';
import { getDriverRounds } from '../https/api';
import { BouceAnimation } from '../components/Animations';
import './css/Home.css';
import './css/ShiftHistory.css';

const ShiftHistory: React.FC = () => {
  const [rounds, setRounds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const fetchRounds = async () => {
    setIsLoading(true);
    try {
      const data = await getDriverRounds(50);
      setRounds(data.data || []);
      setTotalEarnings(data.earnings_total || 0);
    } catch (error) {
      console.error('Error fetching shift history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const doRefresh = async (event: CustomEvent) => {
    await fetchRounds();
    event.detail.complete();
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="ion-no-padding dashboard-header" color="primary">
          <div className="dashboard-hero ion-padding">
            <div className="flex items-center gap-2 mb-4">
              <IonButtons slot="start" className="ion-no-margin">
                <IonBackButton defaultHref="/home" color="light" text="" />
              </IonButtons>
              <IonText color="light">
                <h2 className="text-xl font-bold ion-no-margin">ประวัติรอบการวิ่ง</h2>
              </IonText>
            </div>

            <div className="stats-dashboard mt-2">
              <div className="stat-card glass shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="stat-label larger flex items-center gap-2 text-white">
                      <FontAwesomeIcon icon={faWallet} size="sm" />
                      รายได้รวมทั้งหมด
                    </div>
                    <div className="stat-value larger text-white">
                      {totalEarnings.toLocaleString()} <span className="text-lg font-medium opacity-80">฿</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <FontAwesomeIcon icon={faGasPump} className="text-white opacity-80" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-white/60">
                  <span>จำนวนทั้งสิ้น {rounds.length} รอบ</span>
                  <span>อัปเดตล่าสุด {moment().format('HH:mm')} น.</span>
                </div>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dashboard-content">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <div className="ion-padding tab-bar-padding">
          <div className="section-header flex justify-between items-center mb-4">
            <h3 className="font-bold ion-no-margin" style={{ color: "var(--ion-color-dark)" }}>กิจกรรมย้อนหลัง</h3>
            <div className="text-xs text-slate-400">เรียงตามวันที่ล่าสุด</div>
          </div>
          <br />
          <div className="history-list">
            {rounds.length > 0 ? (
              rounds.map((round, index) => (
                <BouceAnimation key={round.id} duration={(index + 2) / 10}>
                  <div className="activity-item">
                    <div className="activity-header">
                      <div className="activity-info-group">
                        <div className="activity-icon-container">
                          <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="activity-meta">
                          <div className="activity-date">
                            {moment(round.started_at).locale('th').format('DD MMMM YYYY')}
                          </div>
                          <div className="activity-time-range">
                            เวลาทำงาน: {moment(round.started_at).format('HH:mm')} - {moment(round.stopped_at).format('HH:mm')} น.
                          </div>
                        </div>
                      </div>
                      <div className="activity-earning-group">
                        {/* <div className="activity-amount" style={{ background: "#FFF", borderRadius: "10px", padding: "3px 5px 3px 5px" }}>
                          +{(round.stop_mileage ? (round.earnings || 200) : 0).toLocaleString()} ฿
                        </div> */}
                        {
                          round.stop_mileage && round.stopped_at ?
                            <IonBadge color="success" mode="ios" className='text-white' style={{ fontSize: '.8rem', borderRadius: '6px', fontWeight: 400 }}>สำเร็จ</IonBadge>
                            : <IonBadge color="warning" mode="ios" className='text-white' style={{ fontSize: '.8rem', borderRadius: '6px', fontWeight: 400 }}>ยังไม่สิ้นสุด</IonBadge>
                        }

                      </div>
                    </div>

                    <div className="activity-stats-grid">
                      <div className="stat-box">
                        <span className="stat-box-label">ระยะทาง</span>
                        <span className="stat-box-value">{round.stop_mileage - round.start_mileage} กม.</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-box-label">แบตเตอรี่</span>
                        <span className="stat-box-value">{round.start_battery}% → {round.stop_battery}%</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-box-label">เวลาที่ใช้</span>
                        <span className="stat-box-value">
                          {moment.duration(moment(round.stopped_at).diff(moment(round.started_at))).asMinutes().toFixed(0)} นาที
                        </span>
                      </div>
                    </div>

                    {round.notes && round.notes !== '-' && (
                      <div className="activity-notes">
                        <FontAwesomeIcon icon={faCircleInfo} className="note-icon" />
                        <span>หมายเหตุ: {round.notes}</span>
                      </div>
                    )}
                  </div>
                </BouceAnimation>
              ))
            ) : (
              <div className="empty-state-container">
                <FontAwesomeIcon icon={faClipboardList} className="empty-state-icon" />
                <p className="empty-state-text">ยังไม่มีประวัติการเดินรถ</p>
              </div>
            )}
          </div>
        </div>

        <IonLoading isOpen={isLoading} mode="ios" message="กำลังโหลดประวัติ..." />
      </IonContent>
    </IonPage>
  );
};

export default ShiftHistory;
