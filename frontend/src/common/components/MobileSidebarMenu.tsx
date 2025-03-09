import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importe AnimatePresence
import {
  DocumentArrowDownIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import CloudSavedIcon from '@assets/icons/icon_cloud_saved.svg?react';
import { LuLibrary } from 'react-icons/lu';
import CloudNotSavedIcon from '@assets/icons/icon_cloud_notsaved.svg?react';
import { PiFilePdfThin, PiExportThin } from 'react-icons/pi';
import { useDispatch, useSelector } from '../store';
import { saveBookAction, loadBookFromJson } from '@/module/book/BookActions';
import { selectBook, selectBookPages } from '@/module/book/BookSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import useCanvasContext from '@/module/book/useCanvasContext';
import { footerButtonClasses } from '../utils/buttonStyles';
import { Link } from 'react-router-dom';
import { Tooltip } from './Tooltip';
import { mobileSideBarBackgroundRadialStyles } from '../utils/backgroundStyles';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analyticsEvents';
import { useServices } from '../contexts/ServiceContext';

interface MobileSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const { canvas } = useCanvasContext();
  const dispatch = useDispatch();

  const { book, areLocalUpdatesSaved } = useSelector(selectBook);
  const pages = useSelector(selectBookPages);
  const { bookDataService, bookExportService } = useServices();

  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const iconProps = {
    className: 'w-8 h-8',
    strokeWidth: 0.5,
  };

  useEffect(() => {
    if (isOpen) {
      trackEvent(ANALYTICS_EVENTS.MENU_OPENED);
    } else {
      trackEvent(ANALYTICS_EVENTS.MENU_CLOSED);
    }
  }, [isOpen]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;

      try {
        const content = e.target.result as string;
        const importedBook = bookDataService.importBookFromJson(content);
        dispatch(loadBookFromJson(importedBook));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erreur inconnue';
        setError(errorMessage);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Définir les variantes pour l'animation
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
    exit: { x: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-primary-100/75 dark:bg-primary-900/75 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className={`fixed top-0 left-0 h-full w-64 z-50
              flex flex-row items-start
              ${mobileSideBarBackgroundRadialStyles}
              border-r-1 border-gray-300 dark:border-gray-700 shadow-lg`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le menu
          >
            <div className="flex flex-col w-full divide-y-2 divide-primary-200 dark:divide-primary-900/50 ">
              <div className="p-4">
                <button
                  autoFocus={true}
                  className={`${footerButtonClasses}`}
                  onClick={onClose}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ul className="flex flex-col gap-4 p-4 overflow-y-auto">
                <li>
                  <Tooltip content="Accueil">
                    <Link className={footerButtonClasses} to="/">
                      <HomeIcon aria-hidden="true" className="size-6" />
                      <span>Accueil</span>
                    </Link>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip content="Bibliothèque">
                    <Link className={footerButtonClasses} to="/library">
                      <LuLibrary aria-hidden="true" className="size-6" />
                      <span>Bibliothèque</span>
                    </Link>
                  </Tooltip>
                </li>
              </ul>
              <ul className="flex flex-col gap-4 p-4 overflow-y-auto">
                <li>
                  <button
                    className={footerButtonClasses}
                    onClick={async () => {
                      try {
                        await dispatch(
                          saveBookAction({ bookId: book.id, book: book })
                        ).then(unwrapResult);
                      } catch (error) {
                        const errorMessage =
                          error instanceof Error
                            ? error.message
                            : 'Erreur inconnue';
                        setError(errorMessage);
                      }
                    }}
                  >
                    {areLocalUpdatesSaved ? (
                      <CloudSavedIcon className="w-6 h-6 fill-secondary-500" />
                    ) : (
                      <CloudNotSavedIcon className="w-6 h-6 fill-secondary-500" />
                    )}
                    <span>Sauvegarder</span>
                  </button>
                </li>
                <li>
                  <button
                    className={footerButtonClasses}
                    onClick={() => {
                      if (canvas) {
                        bookExportService.exportToPDF({
                          canvas: canvas,
                          pages: pages,
                        });
                      }
                    }}
                  >
                    <PiFilePdfThin {...iconProps} />
                    <span>Télécharger</span>
                  </button>
                </li>
                <li>
                  <button
                    className={footerButtonClasses}
                    onClick={async () => {
                      if (canvas) {
                        await bookExportService.printPDF({
                          canvas: canvas,
                          pages: pages,
                        });
                      }
                    }}
                  >
                    <PrinterIcon {...iconProps} />
                    <span>Imprimer</span>
                  </button>
                </li>
                <li>
                  <button
                    className={footerButtonClasses}
                    onClick={() => {
                      bookDataService.exportBookToFile(book);
                    }}
                  >
                    <PiExportThin {...iconProps} />
                    <span>Exporter</span>
                  </button>
                </li>
                <li>
                  <label className="cursor-pointer">
                    <button
                      className={footerButtonClasses}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <DocumentArrowDownIcon {...iconProps} />
                      <span>Importer</span>
                    </button>
                    <input
                      type="file"
                      accept="application/json"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebarMenu;
