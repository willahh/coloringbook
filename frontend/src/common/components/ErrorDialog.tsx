import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { useTheme } from '@/common/contexts/ThemeContext'; // Assure-toi que ce chemin est correct

interface ErrorDialogProps {
  errorMessage: string;
  isOpen: boolean;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  errorMessage,
  isOpen,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { appearance } = useTheme();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${appearance} relative z-50`}
        onClose={onClose}
        initialFocus={closeButtonRef}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary-50/90 dark:bg-primary-950/90" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-primary-950 shadow-xl transition-all
                    p-6 text-sm text-left align-middle text-gray-700 dark:text-gray-300`}
              >
                <DialogTitle className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
                  Erreur d’import
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {errorMessage}
                </p>
                <div className="mt-4">
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="btn bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-4 py-2 rounded-md transition-colors"
                    onClick={onClose}
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ErrorDialog;
