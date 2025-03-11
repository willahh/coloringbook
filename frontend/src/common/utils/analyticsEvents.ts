import ReactGA from 'react-ga4';
import { ENV_PROD } from '@/common/utils/EnvUtils';
import { Book } from '../types/book';

export const ANALYTICS_EVENTS = {
  // ———————————————————————————————————————————————————————————————————————————
  // global
  // ———————————————————————————————————————————————————————————————————————————
  // Menu
  MENU_OPEN: 'MENU_OPEN',
  MENU_CLOSE: 'MENU_CLOSE',

  // Theme
  THEME_LIGHT_SET: 'THEME_LIGHT_SET',
  THEME_DARK_SET: 'THEME_DARK_SET',

  // Autres interactions
  ABOUT_OPEN: 'ABOUT_OPEN',
  ABOUT_CLOSE: 'ABOUT_CLOSE',
  CHANGELOG_OPEN: 'CHANGELOG_OPEN',
  CHANGELOG_CLOSE: 'CHANGELOG_CLOSE',
  NEWSLETTER_SUBSCRIBE: 'NEWSLETTER_SUBSCRIBE',
  NEWSLETTER_SUBSCRIBE_ERROR: 'NEWSLETTER_SUBSCRIBE_ERROR',
  PAGE_VIEW: 'PAGE_VIEW',
  SCROLL_EVENT: 'SCROLL_EVENT',
  USER_ENGAGE: 'USER_ENGAGE',
  SESSION_START: 'SESSION_START',
  CLICK_BUTTON: 'CLICK_BUTTON',

  // Événements génériques
  ACTION_START: 'ACTION_START',
  ACTION_SUCCESS: 'ACTION_SUCCESS',
  ACTION_FAIL: 'ACTION_FAIL',

  // ———————————————————————————————————————————————————————————————————————————
  // book
  // ———————————————————————————————————————————————————————————————————————————
  // PDF et Export/Import
  BOOK_PDF_EXPORT_START: 'BOOK_PDF_EXPORT_START',
  BOOK_PDF_EXPORT_SUCCESS: 'BOOK_PDF_EXPORT_SUCCESS',
  BOOK_PDF_EXPORT_FAIL: 'BOOK_PDF_EXPORT_FAIL',
  BOOK_PDF_PRINT_START: 'BOOK_PDF_PRINT_START',
  BOOK_PDF_PRINT_SUCCESS: 'BOOK_PDF_PRINT_SUCCESS',
  BOOK_PDF_PRINT_FAIL: 'BOOK_PDF_PRINT_FAIL',
  BOOK_IMPORT_START: 'BOOK_IMPORT_START',
  BOOK_EXPORT_START: 'BOOK_EXPORT_START',

  // Page
  BOOK_PAGE_ADD: 'BOOK_PAGE_ADD',
  BOOK_PAGE_DELETE: 'BOOK_PAGE_DELETE',
  BOOK_UNDO: 'BOOK_UNDO',
  BOOK_REDO: 'BOOK_REDO',
  BOOK_SAVE: 'BOOK_SAVE',
  BOOK_EDIT_BOOK_NAME: 'BOOK_EDIT_BOOK_NAME',
  BOOK_ELEMENT_ADD_TO_PAGE: 'BOOK_ELEMENT_ADD_TO_PAGE',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export const trackBookEvent = (
  analyticsEvent: AnalyticsEvent,
  book: Partial<Book>
) => {
  const label = JSON.stringify({ id: book.id, name: book.name });
  trackEvent(analyticsEvent, label);
};
export const trackEvent = (event: AnalyticsEvent, label?: string) => {
  if (ENV_PROD) {
    ReactGA.event({
      category: 'User Interaction', // Catégorie globale pour simplifier
      action: event,
      label: label || undefined,
    });
  } else {
    console.log('Analytics event (dev):', { action: event, label });
  }
};
