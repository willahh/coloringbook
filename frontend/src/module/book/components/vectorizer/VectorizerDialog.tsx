import React, { useState, useRef, useEffect } from 'react';
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
import { useTheme } from '@/common/contexts/ThemeContext'; // Si vous avez un contexte de thème
import APIService from '@/services/APIService';


const VectorizerDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { appearance } = useTheme();

  useEffect(() => {
    if (imageSrc) {
      setIsOpen(true);
    }
  }, [imageSrc]);

  return (
    <>
      <VectorizerImportButton setImageSrc={setImageSrc} />
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
                    <VectorizerImportButton
                      setImageSrc={setImageSrc}
                      buttonText="Importer une autre image"
                    />
                    {/* <VectorizerExportButton svgOutput={svgOutput} /> */}
                    <button
                      className="btn"
                      onClick={() => {
                        if (svgOutput) {
                          // const element = ElementService.createElement({
                          //   type: 'svg',
                          //   attr: { svgContent: svgOutput },
                          //   h: 1,
                          //   w: 1,
                          //   x: 0,
                          //   y: 0,
                          // });
                          // dispatch(
                          //   addElementToPage({
                          //     element: element,
                          //     pageId: Number(pageId),
                          //   })
                          // );
                          APIService.saveSvg(svgOutput);
                        }
                      }}
                    >
                      <XMarkIcon className="w-6 h-6" />
                      <span>Valider</span>
                    </button>
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
    </>
  );
};

export default VectorizerDialog;
