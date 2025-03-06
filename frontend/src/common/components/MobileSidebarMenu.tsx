import React, { useRef, useState } from 'react';

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
import { saveBookAction, loadBookFromJson } from '@/module/book/book.actions';
import { selectBook, selectBookPages } from '@/module/book/Book.slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { bookService } from '@/services/book.service';
import useCanvasContext from '@/module/book/useCanvasContext';
import { footerButtonClasses } from '../utils/buttonStyles';
import { Link } from 'react-router-dom';
import { Tooltip } from './Tooltip';

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

  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const iconProps = {
    className: 'w-8 h-8',
    strokeWidth: 0.5,
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log('handleFileChange');
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      try {
        const content = e.target?.result as string;
        const importedBook = bookService.importBookFromJson(
          content /*, book.id*/
        );
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

  return (
    <div
      className={`fixed inset-0 dark:bg-primary-900/75 z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-64 
           transform transition-transform duration-300 ease-in-out 
          bg-white dark:bg-primary-950 shadow-lg ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans le menu
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
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
        <ul className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
          <li>
            <Tooltip content="Accueil">
              <Link className={`${footerButtonClasses}`} to="/">
                <HomeIcon aria-hidden="true" className="size-6" />
                <span>Accueil</span>
              </Link>
            </Tooltip>
          </li>
          <li>
            <Tooltip content="Accueil">
              <Link className={`${footerButtonClasses}`} to="/">
                <LuLibrary aria-hidden="true" className="size-6" />
                <span>Bibliothèque</span>
              </Link>
            </Tooltip>
          </li>
          <li>
            <button
              className={`${footerButtonClasses}`}
              onClick={async () => {
                try {
                  await dispatch(
                    saveBookAction({ bookId: book.id, book: book })
                  ).then(unwrapResult);
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : 'Erreur inconnue';
                  setError(errorMessage);
                }
              }}
            >
              {areLocalUpdatesSaved ? (
                <CloudSavedIcon className="w-6 h-6 fill-secondary-500 " />
              ) : (
                <CloudNotSavedIcon className="w-6 h-6 fill-secondary-500" />
              )}
              <span>Sauvegarder</span>
            </button>
          </li>

          <li>
            <button
              className={`${footerButtonClasses}`}
              onClick={() => {
                bookService.exportBookToFile(book);
              }}
            >
              <PiExportThin {...iconProps} />
              <span>Exporter</span>
            </button>
          </li>

          <li>
            <label className="cursor-pointer">
              <button
                className={`${footerButtonClasses}`}
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

          <li>
            <button
              className={`${footerButtonClasses}`}
              onClick={() => {
                if (canvas) {
                  bookService.exportToPDF({
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
              className={`${footerButtonClasses}`}
              onClick={async () => {
                if (canvas) {
                  await bookService.printPDF({
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
        </ul>
      </div>
    </div>
  );
};

export default MobileSidebarMenu;
