import { Middleware } from '@reduxjs/toolkit';
import { trackEvent, ANALYTICS_EVENTS } from './utils/analyticsEvents';

interface ReduxAction {
  type: string;
  payload?: any;
  error?: any;
}

export const analyticsMiddleware: Middleware =
  () => (next) => (action: unknown) => {
    const typedAction = action as ReduxAction;

    // // Mapping personnalisé des actions Redux vers des événements
    // switch (typedAction.type) {
    //   case 'EXPORT_PDF/pending':
    //     trackEvent(ANALYTICS_EVENTS.BOOK_PDF_EXPORT_START);
    //     break;
    //   case 'EXPORT_PDF/fulfilled':
    //     trackEvent(
    //       ANALYTICS_EVENTS.BOOK_PDF_EXPORT_SUCCESS,
    //       typedAction.payload?.fileName
    //     );
    //     break;
    //   case 'EXPORT_PDF/rejected':
    //     trackEvent(
    //       ANALYTICS_EVENTS.BOOK_PDF_EXPORT_FAIL,
    //       typedAction.error?.message
    //     );
    //     break;
    //   // Ajoutez d'autres cas pour PRINT_PDF, IMPORT_BOOK_DATA, etc.
    //   default:
    //     break;
    // }

    // // Gestion générique pour les autres actions (facultatif)
    // if (typedAction.type.endsWith('/fulfilled')) {
    //   trackEvent(ANALYTICS_EVENTS.ACTION_SUCCESS, typedAction.type);
    // } else if (typedAction.type.endsWith('/pending')) {
    //   trackEvent(ANALYTICS_EVENTS.ACTION_START, typedAction.type);
    // } else if (typedAction.type.endsWith('/rejected')) {
    //   trackEvent(ANALYTICS_EVENTS.ACTION_FAIL, typedAction.error?.message);
    // }

    return next(typedAction);
  };
