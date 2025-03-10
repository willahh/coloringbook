import ReactGA from 'react-ga4';
import { ENV_PROD } from '@/common/utils/EnvUtils';

export enum EventCategory {
  Action = 'Action',
  About = 'About',
  Changelog = 'Changelog',
  Menu = 'Menu',
  Newsletter = 'Newsletter',
  APPEAREANCE_LIGHT = 'APPEAREANCE_LIGHT',
  APPEAREANCE_DARK = 'APPEAREANCE_DARK',
  EXPORT_PDF = 'EXPORT_PDF',
  PRINT_PDF = 'PRINT_PDF',
  IMPORT_BOOK_DATA = 'IMPORT_BOOK_DATA',
  EXPORT_BOOK_DATA = 'EXPORT_BOOK_DATA',
}

export enum EventAction {
  Opened = 'Opened',
  Closed = 'Closed',
  Subscribed = 'Subscribed',
  Switched = 'Switched',
  Error = 'Error',
  Completed = 'Completed',
  Started = 'Started',
  Rejected = 'Rejected',
}

export type EventLabel = string;

export interface AnalyticsEvent {
  action: EventAction;
  category: EventCategory;
  label?: EventLabel;
}

// Events
export const MENU_OPENED: AnalyticsEvent = {
  action: EventAction.Opened,
  category: EventCategory.Menu,
};
export const MENU_CLOSED: AnalyticsEvent = {
  action: EventAction.Closed,
  category: EventCategory.Menu,
};
export const ABOUT_OPENED = {
  action: EventAction.Opened,
  category: EventCategory.About,
};
export const CHANGELOG_OPENED = {
  action: EventAction.Opened,
  category: EventCategory.Changelog,
};
export const NEWSLETTER_SUBSCRIBED = {
  action: EventAction.Subscribed,
  category: EventCategory.Newsletter,
};
export const APPEAREANCE_LIGHT = {
  action: EventAction.Switched,
  category: EventCategory.APPEAREANCE_LIGHT,
};
export const APPEAREANCE_DARK = {
  action: EventAction.Switched,
  category: EventCategory.APPEAREANCE_DARK,
};
export const EXPORT_PDF = {
  action: EventAction.Started,
  category: EventCategory.EXPORT_PDF,
};
export const PRINT_PDF = {
  action: EventAction.Started,
  category: EventCategory.PRINT_PDF,
};
export const IMPORT_BOOK_DATA = {
  action: EventAction.Started,
  category: EventCategory.IMPORT_BOOK_DATA,
};
export const EXPORT_BOOK_DATA = {
  action: EventAction.Started,
  category: EventCategory.EXPORT_BOOK_DATA,
};

// trackEvent
export const trackEvent = ({ category, action, label }: AnalyticsEvent) => {
  if (ENV_PROD) {
    ReactGA.event({ category, action, label });
  } else {
    console.log('Analytics event (dev):', { category, action, label });
  }
};
