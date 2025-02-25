import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Pour l'icône de X (Twitter)

interface AboutDialogProps {
  version: string;
  buildDate: string;
}
export const getLastBuildText = (buildDate: Date) => {
  const buildDateObj = new Date(buildDate);
  return formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr }) ===
    'il y a moins d’une minute'
    ? `aujourd'hui à ${format(buildDateObj, 'HH:mm')}`
    : formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr });
};

const AboutDialog: React.FC<AboutDialogProps> = ({ version, buildDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buildDateObj = new Date(buildDate);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastBuildText = getLastBuildText(buildDateObj);

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
          className="relative z-50"
          onClose={() => setIsOpen(false)}
          initialFocus={closeButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-primary-950 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Coloring Book
                  </Dialog.Title>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
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
                    <li className="flex items-center gap-2">
                      <span>Auteur: </span>
                      <a
                        href="https://williamravel.netlify.app/"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        William Ravel
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
                    </li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Mentions légales
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Mentions légales Coloring Book © 2025 William Ravel. Tous
                      droits réservés. Cette application et son code source sont
                      protégés par le droit d’auteur. Toute reproduction,
                      distribution ou modification non autorisée est interdite.
                      Le code source disponible sur GitHub est fourni sous
                      licence spécifique et ne peut être utilisé à des fins
                      commerciales sans accord explicite de l’auteur.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Vous avez un projet web ou une application interactive en
                      tête ?
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Je suis développeur freelance spécialisé en développement
                      web et applications interactives. Discutons-en ! Pour
                      toute utilisation professionnelle de cette application ou
                      demande de partenariat, contactez-moi via mon portfolio ou
                      mon LinkedIn.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      ref={closeButtonRef}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-secondary-500 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AboutDialog;
