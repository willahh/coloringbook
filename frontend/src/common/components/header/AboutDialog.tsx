import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns'; // Pour formater la date
import { fr } from 'date-fns/locale'; // Locale française pour "il y a X jours"

interface AboutDialogProps {
  version: string;
  buildDate: string;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ version, buildDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buildDateObj = new Date(buildDate);

  // Calculer "il y a X jours" ou "aujourd'hui à HH:mm"
  const lastBuildText =
    formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr }) ===
    'il y a moins d’une minute'
      ? `aujourd'hui à ${format(buildDateObj, 'HH:mm')}`
      : formatDistanceToNow(buildDateObj, { addSuffix: true, locale: fr });

  return (
    <>
      {/* Bouton "About" */}
      <div
        className={`flex gap-1 bg-secondary-500 rounded-md px-1 py-0.5 text-secondary-100 font-semibold
          hover:bg-secondary-600 hover:text-white cursor-pointer transition-all`}
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

      {/* Boîte de dialogue */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Coloring Book
                  </Dialog.Title>
                  <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium">Alpha</span> v{version}
                    </p>
                    <p>
                      <span className="font-medium">Version</span> {version}
                    </p>
                    <p>
                      <span className="font-medium">Dernier build</span>{' '}
                      {lastBuildText}
                    </p>
                    <p>
                      <span className="font-medium">Auteur</span>{' '}
                      <a
                        href="https://williamravel.netlify.app/"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        William Ravel
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Signaler un problème</span>{' '}
                      <a
                        href="https://github.com/willahh/coloringbook/issues"
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        GitHub Issues
                      </a>
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Mentions légales
                    </h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Coloring Book est une œuvre protégée par le droit d’auteur
                      © 2025 William Ravel. Tous droits réservés. Le code
                      source, disponible sur GitHub, est fourni à des fins
                      éducatives et personnelles uniquement. Toute reproduction,
                      modification, distribution ou utilisation commerciale sans
                      autorisation explicite de l’auteur est strictement
                      interdite et passible de poursuites judiciaires. Les
                      voleurs de code s’exposent à des conséquences graves, y
                      compris des actions en justice pour violation de propriété
                      intellectuelle. Soyez respectueux : créez votre propre
                      art, pas celui des autres.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-secondary-500 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
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
