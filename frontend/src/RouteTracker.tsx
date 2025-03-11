import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ENV_PROD } from './common/utils/EnvUtils';
import { trackPageView } from './common/utils/analyticsEvents';

interface RouteTrackerProps {
  children?: ReactNode;
}

const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
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

  return <>{children}</>;
};

export default RouteTracker;
