/**
 * This hook manages the automatic opening of a dialog based on the user's visit history.
 * It uses local storage to track the last time the dialog was shown and sets timers to open the dialog
 * on the first visit and subsequent visits after a specified delay.
 */

import { useState, useEffect, useRef } from 'react';
import useLocalStorage from '@/common/hooks/useLocalStorage';

// const SUBSEQUENT_VISIT_DE = 1 * 60 * 60 * 1000; // 1 heure
// const SUBSEQUENT_VISIT_DE = 1 * 1 * 60 * 1000; // 1 minute
const FIRST_VISIT_DELAY_____ = 1 * 1 * 17 * 1000; // 17 secondes
const SUBSEQUENT_VISIT_DELAY = 1 * 60 * 60 * 1000; // 1 heure

export const useAutoOpenDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useLocalStorage('about-ts', 0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutBRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!lastSeen) {
      // La fenêtre n'a jamais été affichée
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        setLastSeen(Date.now());
      }, FIRST_VISIT_DELAY_____);
    }

    timeoutBRef.current = setTimeout(() => {
      setLastSeen(Date.now());
      setIsOpen(true);
    }, SUBSEQUENT_VISIT_DELAY);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timeoutBRef.current) clearTimeout(timeoutBRef.current);
    };
  }, []);

  return { isOpen, setIsOpen };
};
