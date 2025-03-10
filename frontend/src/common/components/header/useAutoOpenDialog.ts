/**
 * This hook manages the automatic opening of a dialog based on the user's visit history.
 * It ensures the dialog opens only once using local storage to track the last display.
 */

import { useState, useEffect, useRef } from 'react';
import useLocalStorage from '@/common/hooks/useLocalStorage';

// const SUBSEQUENT_VISIT_DE = 1 * 60 * 60 * 1000; // 1 heure
// const SUBSEQUENT_VISIT_DE = 1 * 1 * 60 * 1000; // 1 minute
const FIRST_VISIT_DELAY = 1 * 1 * 17 * 1000; // 17 secondes
// const SUBSEQUENT_VISIT_DELAY = 1 * 60 * 60 * 1000; // 1 heure

export const useAutoOpenDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSeen, setLastSeen] = useLocalStorage('about-ts', 0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si la boîte n'a jamais été affichée (lastSeen = 0) ou si elle a été affichée 
    // mais qu'on veut la réafficher une seule fois
    if (!lastSeen) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        setLastSeen(Date.now()); // Marque l'affichage comme terminé
      }, FIRST_VISIT_DELAY); // Remplacez par votre constante si nécessaire
    }

    // Nettoyage des timers au démontage
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lastSeen]); // Dépendance sur lastSeen pour éviter les recréations inutiles

  return { isOpen, setIsOpen };
};
