import { ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { ENV_PROD } from './common/utils/EnvUtils';

interface RouteTrackerProps {
  children?: ReactNode;
}

const TRACKING_ID = 'G-HMZMXBTT09';

if (ENV_PROD) {
  ReactGA.initialize(TRACKING_ID);
}

const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const obj = {
      hitType: 'pageview',
      page: location.pathname + location.search,
    };
    if (ENV_PROD) {
      // Only send GA in production environment
      ReactGA.send(obj);
    }
  }, [location]);

  return <>{children}</>; // Rendre les children (ou null si aucun child)
};

export default RouteTracker;
