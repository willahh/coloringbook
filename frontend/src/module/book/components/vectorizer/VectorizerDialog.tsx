import React, { useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment } from 'react';

import VectorizerImportButton from './VectorizerImportButton';
import VectorizerForm from './VectorizerForm';
import VectorizerExportButton from './VectorizerExportButton';
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
  const { appearance } = useTheme();

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
                className={`w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-primary-950 shadow-xl transition-all
                p-6 text-sm text-left align-middle text-gray-700 dark:text-gray-300`}
              >
                <DialogTitle className="flex gap-4 justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Convertisseur d'image Bitmap en SVG
                  <span>
                    <button
                      className="btn btn-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </span>
                </DialogTitle>

                <div className="flex gap-2 mt-4">
                  <VectorizerImportButton setImageSrc={setImageSrc} />
                  <VectorizerExportButton svgOutput={svgOutput} />
                </div>

                {imageSrc && (
                  <div className="mt-4">
                    <VectorizerForm
                      imageSrc={imageSrc}
                      setSvgOutput={setSvgOutput}
                    />
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

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
