import { useRef, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit'; // Ajoute cette import
import {
  DocumentArrowDownIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { PiFilePdfThin, PiExportThin } from 'react-icons/pi';

import CloudSavedIcon from '@assets/icons/icon_cloud_saved.svg?react';
import CloudNotSavedIcon from '@assets/icons/icon_cloud_notsaved.svg?react';

import ErrorDialog from '@/common/components/ErrorDialog'; // Ajuste l
import { ToolbarButton } from './ToolbarButton';
import useCanvasContext from '../useCanvasContext';
import { useDispatch, useSelector } from '@/common/store';
import { selectBook, selectBookPages } from '../BookSlice';
import { saveBookAction, loadBookFromJson } from '../BookActions';
import { useServices } from '@/common/contexts/ServiceContext';
import { BookDataService } from '@/services/book/BookDataService';
import { trackBookEvent } from '@/common/utils/analyticsEvents';

const BookToolbar: React.FC = () => {
  const { canvas } = useCanvasContext();
  const dispatch = useDispatch();
  const pages = useSelector(selectBookPages);
  const { book, areLocalUpdatesSaved } = useSelector(selectBook);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { bookDataService, bookExportService } = useServices();
  const iconProps = {
    className: 'w-8 h-8',
    strokeWidth: 0.5,
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    bookDataService: BookDataService
  ) => {
    console.log('handleFileChange');
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      try {
        const content = e.target?.result as string;
        const importedBook = bookDataService.importBookFromJson(
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
    <>
      <ErrorDialog
        title="Erreur d’import"
        message={error || ''}
        isOpen={!!error}
        onClose={() => {
          setError(null);
        }}
      />
      <div
        data-id="book-toolbar"
        className={`flex flex-col relative h-full z-20  justify-center gap-4
         bg-primary-50 dark:bg-primary-950
         border-r border-primary-100 dark:border-primary-900 `}
      >
        <ToolbarButton
          tooltipContent="Sauvegarder"
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
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Export"
          onClick={() => {
            trackBookEvent('BOOK_EXPORT_START', book);
            bookDataService.exportBookToFile(book);
          }}
        >
          <PiExportThin {...iconProps} />
        </ToolbarButton>
        <label className="cursor-pointer">
          <ToolbarButton
            tooltipContent="Import"
            onClick={() => {
              trackBookEvent('BOOK_IMPORT_START', book);
              fileInputRef.current?.click();
            }}
          >
            <DocumentArrowDownIcon {...iconProps} />
          </ToolbarButton>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={(event) => {
              handleFileChange(event, bookDataService);
            }}
            style={{ display: 'none' }}
          />
        </label>
        <ToolbarButton
          tooltipContent="Download"
          onClick={() => {
            if (canvas) {
              trackBookEvent('BOOK_PDF_EXPORT_START', book);
              bookExportService.exportToPDF({
                canvas: canvas,
                pages: pages,
              });
            }
          }}
        >
          <PiFilePdfThin {...iconProps} />
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Print"
          onClick={async () => {
            if (canvas) {
              trackBookEvent('BOOK_PDF_PRINT_START', book);
              await bookExportService.printPDF({
                canvas: canvas,
                pages: pages,
              });
            }
          }}
        >
          <PrinterIcon {...iconProps} />
        </ToolbarButton>
      </div>
    </>
  );
};

export default BookToolbar;
