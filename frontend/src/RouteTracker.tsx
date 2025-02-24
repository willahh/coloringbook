import { ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

interface RouteTrackerProps {
  children?: ReactNode; // Rendre children optionnel
}

const TRACKING_ID = 'G-HMZMXBTT09';

// if (process.env.NODE_ENV === 'production') {
ReactGA.initialize(TRACKING_ID);
// }

const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const obj = {
      hitType: 'pageview',
      page: location.pathname + location.search,
    };
    console.log('#f RouteTracker.tsx useEffect, send event to GA', obj);
    // if (process.env.NODE_ENV === 'production') {
    ReactGA.send(obj);
    // }
  }, [location]);

  return <>{children}</>; // Rendre les children (ou null si aucun child)
};

export default RouteTracker;
