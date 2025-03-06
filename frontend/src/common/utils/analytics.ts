import ReactGA from 'react-ga4';
import { ENV_PROD } from './EnvUtils';

export const trackEvent = (
  category: string,
  action: string,
  label?: string
) => {
  if (ENV_PROD) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
