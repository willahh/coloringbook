'use client';

import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ToastProps {
  message: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
  autoClose?: number;
}

/**
 * Le composant `Toast` est utilisé pour afficher des notifications temporaires à l'utilisateur.
 * Il peut afficher différents types de messages : succès, erreur et information.
 *
 * @param {string} message - Le message principal à afficher.
 * @param {string} [description] - Une description supplémentaire pour le message.
 * @param {'success' | 'error' | 'info'} type - Le type de notification.
 * @param {boolean} show - Détermine si la notification est visible.
 * @param {function} onClose - Fonction à appeler lorsque la notification est fermée.
 * @param {number} [autoClose] - Temps en secondes avant que la notification ne se ferme automatiquement.
 *
 * @example
 * // Exemple 1 : Notification de succès
 * import { useState } from 'react';
 * import Toast from './Toast';
 *
 * function App() {
 *   const [showToast, setShowToast] = useState(true);
 *
 *   return (
 *     <div>
 *       <Toast
 *         message="Successfully saved!"
 *         description="Anyone with a link can now view this file."
 *         type="success"
 *         show={showToast}
 *         onClose={() => setShowToast(false)}
 *         autoClose={5} // Ferme automatiquement après 5 secondes
 *       />
 *     </div>
 *   );
 * }
 *
 * @example
 * // Exemple 2 : Notification d'erreur
 * import { useState } from 'react';
 * import Toast from './Toast';
 *
 * function App() {
 *   const [showToast, setShowToast] = useState(true);
 *
 *   return (
 *     <div>
 *       <Toast
 *         message="Error occurred!"
 *         description="Please try again later."
 *         type="error"
 *         show={showToast}
 *         onClose={() => setShowToast(false)}
 *         autoClose={5} // Ferme automatiquement après 5 secondes
 *       />
 *     </div>
 *   );
 * }
 *
 * @example
 * // Exemple 3 : Notification d'information
 * import { useState } from 'react';
 * import Toast from './Toast';
 *
 * function App() {
 *   const [showToast, setShowToast] = useState(true);
 *
 *   return (
 *     <div>
 *       <Toast
 *         message="Information"
 *         description="This is an informational message."
 *         type="info"
 *         show={showToast}
 *         onClose={() => setShowToast(false)}
 *         autoClose={5} // Ferme automatiquement après 5 secondes
 *       />
 *     </div>
 *   );
 * }
 */
export default function Toast({
  message,
  description,
  type,
  show,
  onClose,
  autoClose = 8, // Set default value to 8 seconds
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoClose * 1000);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <CheckCircleIcon
            aria-hidden="true"
            className="size-6 text-green-400"
          />
        );
      case 'error':
        return (
          <ExclamationCircleIcon
            aria-hidden="true"
            className="size-6 text-red-400"
          />
        );
      case 'info':
        return (
          <InformationCircleIcon
            aria-hidden="true"
            className="size-6 text-blue-400"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={isVisible}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">{getIcon()}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {message}
                    </p>
                    {description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsVisible(false);
                        onClose();
                      }}
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
