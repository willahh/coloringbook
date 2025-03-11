import { v4 as uuidv4 } from 'uuid'; // Génère un client_id unique
import { ENV_PROD } from '@/common/utils/EnvUtils';
import { Book } from '../types/book';
import { getAPIURL } from './api';

export const ANALYTICS_EVENTS = {
  // Global
  MENU_OPEN: 'MENU_OPEN',
  MENU_CLOSE: 'MENU_CLOSE',
  THEME_LIGHT_SET: 'THEME_LIGHT_SET',
  THEME_DARK_SET: 'THEME_DARK_SET',
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
  ACTION_START: 'ACTION_START',
  ACTION_SUCCESS: 'ACTION_SUCCESS',
  ACTION_FAIL: 'ACTION_FAIL',

  // Book
  BOOK_PDF_EXPORT_START: 'BOOK_PDF_EXPORT_START',
  BOOK_PDF_EXPORT_SUCCESS: 'BOOK_PDF_EXPORT_SUCCESS',
  BOOK_PDF_EXPORT_FAIL: 'BOOK_PDF_EXPORT_FAIL',
  BOOK_PDF_PRINT_START: 'BOOK_PDF_PRINT_START',
  BOOK_PDF_PRINT_SUCCESS: 'BOOK_PDF_PRINT_SUCCESS',
  BOOK_PDF_PRINT_FAIL: 'BOOK_PDF_PRINT_FAIL',
  BOOK_IMPORT_START: 'BOOK_IMPORT_START',
  BOOK_EXPORT_START: 'BOOK_EXPORT_START',
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

// Utilitaire pour gérer le client_id
const getClientId = (): string => {
  const storageKey = 'ga_client_id';
  let clientId = localStorage.getItem(storageKey);
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem(storageKey, clientId);
  }
  return clientId;
};

interface AnalyticsParams {
  label?: string;
  page_path?: string;
  page_location?: string;
  page_title?: string;
}

const sendToProxy = async (
  eventName: string,
  params: AnalyticsParams = {}
): Promise<void> => {
  const clientId = getClientId();
  const apiUrl = `${getAPIURL()}/track`;

  const payload = {
    client_id: clientId,
    event_name: eventName,
    params,
  };

  console.info('[GA.proxy] event: ', eventName, params);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending event to proxy:', error);
    throw error; // Permet aux appelants de gérer l'erreur si nécessaire
  }
};

// Fonction pour tracker une pageview
export const trackPageView = async (
  pagePath: string,
  pageTitle: string
): Promise<void> => {
  if (!ENV_PROD) {
    console.log('[ga] pageView (dev):', { pagePath, pageTitle });
    return;
  }

  await sendToProxy('page_view', {
    page_location: pagePath,
    page_title: pageTitle,
  });
};

// Fonction générique pour tracker un événement
export const trackEvent = async (
  event: AnalyticsEvent,
  label?: string
): Promise<void> => {
  if (!ENV_PROD) {
    console.log('[ga] event (dev):', { action: event, label });
    return;
  }
  await sendToProxy(event, label ? { label } : {});
};

// Fonction spécifique pour les événements liés à un livre
export const trackBookEvent = async (
  event: AnalyticsEvent,
  book: Partial<Book>
): Promise<void> => {
  if (!ENV_PROD) {
    console.log('[ga] event (dev):', { action: event, book });
    return;
  }
  const label = JSON.stringify({ id: book.id, name: book.name });
  await trackEvent(event, label);
};
