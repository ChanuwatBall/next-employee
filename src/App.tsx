import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, home, square, triangle } from 'ionicons/icons';
import Home from './pages/Home';
import ScanQrPage from './pages/ScanQrPage';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import TicketDetail from './pages/TicketDetail';
import Sigin from './pages/Sigin';
import React from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
import PlanChair from './pages/PlanChair';
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import PlanChair from './pages/PlanChair';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faHouse, faUser } from '@fortawesome/free-regular-svg-icons';

setupIonicReact();

const App: React.FC = () => {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/plan/:id" exact>
              <PlanChair />
            </Route>
            <Route exact path="/signin">
              <Sigin />
            </Route>
            <Route exact path="/home">
              {isAuthenticated ? <Home /> : <Redirect to="/signin" />}
            </Route>
            <Route exact path="/scanQrPage">
              {isAuthenticated ? <ScanQrPage /> : <Redirect to="/signin" />}
            </Route>
            <Route path="/profile">
              {isAuthenticated ? <Profile /> : <Redirect to="/signin" />}
            </Route>
            <Route exact path="/trips">
              {isAuthenticated ? <Trips /> : <Redirect to="/signin" />}
            </Route>
            <Route path="/trip/:id">
              {isAuthenticated ? <TripDetail /> : <Redirect to="/signin" />}
            </Route>
            <Route path="/ticket/:id">
              {isAuthenticated ? <TicketDetail /> : <Redirect to="/signin" />}
            </Route>
            <Route exact path="/">
              <Redirect to={isAuthenticated ? '/home' : '/signin'} />
            </Route>
          </IonRouterOutlet>
          {isAuthenticated && (
            <IonTabBar slot="bottom" className='main-tab'>
              <IonTabButton tab="tab1" href="/home">
              <FontAwesomeIcon icon={faHouse} />
                {/* <IonIcon aria-hidden="true" icon={home} /> */}
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/scanQrPage">
              <FontAwesomeIcon icon={faQrcode} />
                {/* <IonIcon aria-hidden="true" icon={ellipse} /> */}
                <IonLabel>Scan</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/profile">
              <FontAwesomeIcon icon={faUser} />
                {/* <IonIcon aria-hidden="true" icon={square} /> */}
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
