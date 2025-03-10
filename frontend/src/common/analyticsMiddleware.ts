import { Middleware } from '@reduxjs/toolkit';

import { trackEvent } from './utils/analyticsEvents';
import { EventCategory, EventAction } from '@/common/utils/analyticsEvents';

interface ReduxAction {
  type: string;
}

export const analyticsMiddleware: Middleware =
  () => (next) => (action: unknown) => {
    const typedAction = action as ReduxAction;
    if (typedAction.type.endsWith('/fulfilled')) {
      trackEvent({
        category: EventCategory.Action,
        action: EventAction.Completed,
        label: typedAction.type,
      });
    } else if (typedAction.type.endsWith('/pending')) {
      trackEvent({
        category: EventCategory.Action,
        action: EventAction.Started,
        label: typedAction.type,
      });
    } else if (typedAction.type.endsWith('/rejected')) {
      trackEvent({
        category: EventCategory.Action,
        action: EventAction.Rejected,
        label: typedAction.type,
      });
    }

    return next(typedAction);
  };
