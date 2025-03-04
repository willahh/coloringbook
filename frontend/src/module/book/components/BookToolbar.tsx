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
import { bookService } from '@/services/book.service';
import useCanvasContext from '../useCanvasContext';
import { useDispatch, useSelector } from '@/common/store';
import { selectBook, selectBookPages } from '../Book.slice';
import { saveBookAction, loadBookFromJson } from '../book.actions';

const BookToolbar: React.FC = () => {
  const { canvas } = useCanvasContext();
  const dispatch = useDispatch();
  const pages = useSelector(selectBookPages);
  const { book, areLocalUpdatesSaved } = useSelector(selectBook);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        const importedBook = bookService.importBookFromJson(content/*, book.id*/);
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
      <div>
        <div
          className={`flex flex-col relative h-full z-20  justify-center gap-4
         bg-primary-50 dark:bg-primary-950
         border-r border-primary-100 dark:border-primary-900 `}
        >
          <ToolbarButton
            tooltipContent="Sauvegarder"
            onClick={async () => {
              try {
                console.log('#a before dispatch saveBookAction');
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

            {/* <ArrowDownOnSquareStackIcon {...iconProps} /> */}
          </ToolbarButton>
          <ToolbarButton
            tooltipContent="Export"
            onClick={() => {
              bookService.exportBookToFile(book);
            }}
          >
            <PiExportThin {...iconProps} />
          </ToolbarButton>
          <label className="cursor-pointer">
            <ToolbarButton
              tooltipContent="Import"
              onClick={() => fileInputRef.current?.click()}
            >
              <DocumentArrowDownIcon {...iconProps} />
            </ToolbarButton>
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          <ToolbarButton
            tooltipContent="Download"
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
          </ToolbarButton>
          <ToolbarButton
            tooltipContent="Print"
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
          </ToolbarButton>
        </div>
      </div>
    </>
  );
};

export default BookToolbar;
