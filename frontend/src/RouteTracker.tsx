import { ReactNode, useEffect } from 'react';
// import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { ENV_PROD } from './common/utils/EnvUtils';
import { trackPageView } from './common/utils/analyticsEvents';

interface RouteTrackerProps {
  children?: ReactNode;
}

// const GA_MEASUREMENT_ID = 'G-HMZMXBTT09';

// if (ENV_PROD) {
// ReactGA.initialize(GA_MEASUREMENT_ID);
// }

const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log('useEffect location change');
    if (ENV_PROD) {
      // Only send GA in production environment
      // const obj = {
      //   hitType: 'pageview',
      //   page: location.pathname + location.search,
      // };
      // ReactGA.send(obj);
      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location]);

  return <>{children}</>; // Rendre les children (ou null si aucun child)
};

export default RouteTracker;
