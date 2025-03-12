import React, { useState, useRef } from 'react';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment } from 'react';
import ImageImporter from './ImageImporter';
import Vectorizer from './Vectorizer';
import SvgExporter from './SvgExporter';
import { useTheme } from '@/common/contexts/ThemeContext'; // Si vous avez un contexte de thème

interface VectorizerDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VectorizerDialog: React.FC<VectorizerDialogProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { appearance } = useTheme(); // Si vous utilisez un contexte de thème

  return (
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
          <div className="flex min-h-full items-center justify-center p-6 text-center">
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
                className={`w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-primary-950 shadow-xl transition-all
                p-6 text-sm text-left align-middle text-gray-700 dark:text-gray-300`}
              >
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Convertisseur d'image Bitmap en SVG
                </DialogTitle>

                <div className="mt-4">
                  <ImageImporter setImageSrc={setImageSrc} />
                </div>

                {imageSrc && (
                  <>
                    <div className="mt-4 bg-white">
                      <Vectorizer
                        imageSrc={imageSrc}
                        setSvgOutput={setSvgOutput}
                      />
                    </div>
                    <div className="mt-4">
                      <SvgExporter svgOutput={svgOutput} />
                    </div>
                  </>
                )}

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
  );
};

// Composant principal avec un bouton pour ouvrir le dialog
const VectorizerComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setIsOpen(true)}>
        Convertir une image en SVG
      </button>
      <VectorizerDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default VectorizerComponent;
