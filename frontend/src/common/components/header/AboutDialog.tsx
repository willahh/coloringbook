import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter, FaInternetExplorer } from 'react-icons/fa6';
import { useTheme } from '@/common/contexts/ThemeContext';
import Newsletter from './Newsletter';

interface AboutDialogProps {
  version: string;
  buildDate: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const getLastBuildText = (buildDate: Date) => {
  const buildDateObj = new Date(buildDate);
  return formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr }) ===
    'il y a moins d’une minute'
    ? `aujourd'hui à ${format(buildDateObj, 'HH:mm')}`
    : formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr });
};

const AboutDialog: React.FC<AboutDialogProps> = ({
  version,
  buildDate,
  isOpen,
  setIsOpen,
}) => {
  const buildDateObj = new Date(buildDate);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastBuildText = getLastBuildText(buildDateObj);
  const { appearance } = useTheme();

  return (
    <>
      <div
        className="flex gap-1 bg-secondary-500 rounded-md px-1 py-0.5 text-secondary-100 font-semibold hover:bg-secondary-600 hover:text-white cursor-pointer transition-all"
        onClick={() => setIsOpen(true)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
        About
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${appearance} relative z-50`}
          onClose={() => setIsOpen(false)}
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
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Coloring Book
                  </DialogTitle>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <span className="font-medium">Version: </span> v{version}
                    </li>
                    <li>
                      <span className="font-medium">Dernier build: </span>{' '}
                      {lastBuildText}
                    </li>
                    <li>
                      <span className="font-medium">
                        Signaler un problème:{' '}
                      </span>
                      <a
                        href="https://github.com/willahh/coloringbook/issues"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        GitHub Issues
                      </a>
                    </li>
                    <li>
                      <span className="font-medium">Auteur: </span>{' '}
                      <a
                        href="https://williamravel.netlify.app/"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        William Ravel
                      </a>
                    </li>
                  </ul>

                  <div className="mt-4">
                    <Newsletter
                      onSubscribe={(email: string) => {
                        console.log('Newsletter', email);
                      }}
                    />
                  </div>

                  <div className="mt-4"></div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Un projet web ou une application en tête ?
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Je suis développeur freelance spécialisé en développement
                      web et applications interactives. Discutons-en !
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href="https://williamravel.netlify.app/"
                        target="_blank"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <FaInternetExplorer size={18} />
                      </a>
                      <a
                        href="https://github.com/willahh"
                        target="_blank"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        title="GitHub"
                      >
                        <FaGithub size={18} />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/wravel/"
                        target="_blank"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        title="LinkedIn"
                      >
                        <FaLinkedin size={18} />
                      </a>
                      <a
                        href="mailto:wravel@gmail.com"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        title="Email"
                      >
                        <FaEnvelope size={18} />
                      </a>
                      <a
                        href="https://x.com/willahhravel"
                        target="_blank"
                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        title="X (Twitter)"
                      >
                        <FaXTwitter size={18} />
                      </a>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Mentions légales
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Coloring Book © 2025 William Ravel. Tous droits réservés.
                      Cette application et son code source sont protégés par le
                      droit d’auteur. Toute reproduction, distribution ou
                      modification non autorisée est interdite. Le code source
                      disponible sur GitHub est fourni sous licence spécifique
                      et ne peut être utilisé à des fins commerciales sans
                      accord explicite de l’auteur.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      ref={closeButtonRef}
                      type="button"
                      className="btn"
                      onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default AboutDialog;
