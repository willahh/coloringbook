import ReactGA from 'react-ga4';
import { ENV_PROD } from './EnvUtils';

type EventCategory = 'Menu' | 'Coloring' | 'User' | 'Tools' | 'Navigation';
type EventAction =
  | 'Opened'
  | 'Closed'
  | 'Clicked'
  | 'Started'
  | 'Completed'
  | 'Selected';
type EventLabel = string; // Peut rester flexible ou être typé plus tard selon tes besoins

// Interface pour un événement
interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction;
  label?: EventLabel;
}

export const ANALYTICS_EVENTS = {
  MENU_OPENED: {
    category: 'Menu' as const,
    action: 'Opened' as const,
    label: 'Mobile',
  },
  MENU_CLOSED: {
    category: 'Menu' as const,
    action: 'Closed' as const,
    label: 'Mobile',
  },
  COLORING_STARTED: {
    category: 'Coloring' as const,
    action: 'Started' as const,
  },
  COLORING_COMPLETED: {
    category: 'Coloring' as const,
    action: 'Completed' as const,
  },
  TOOL_SELECTED: { category: 'Tools' as const, action: 'Selected' as const },
} satisfies Record<string, AnalyticsEvent>;

// Fonction utilitaire typée
export const trackEvent = ({ category, action, label }: AnalyticsEvent) => {
  console.log('trackEvent', category, action, label);
  //   if (ENV_PROD) {
  // Remplace ENV_PROD par une vérif native
  ReactGA.event({
    category,
    action,
    label,
  });
  //   }
};
