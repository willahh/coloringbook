import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { UnsavedChangesComponent } from '@/module/book/components/UnchangedModificationsToast';
import { useTheme } from '@/common/contexts/ThemeContext';
import CloudSavedIcon from '@assets/icons/icon_cloud_saved.svg?react';
import CloudNotSavedIcon from '@assets/icons/icon_cloud_notsaved.svg?react';
import { saveBookAction } from '@/module/book/book.actions';
import { useDispatch, useSelector } from '@/common/store';
import { selectBook } from '@/module/book/Book.slice';
interface SavePopOverProps {
  areLocalUpdatesSaved: boolean;
}

const SavePopOver: React.FC<SavePopOverProps> = ({ areLocalUpdatesSaved }) => {
  const popoverButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { appearance } = useTheme();
  const dispatch = useDispatch();
  const { book } = useSelector(selectBook);

  return (
    <>
      <Popover className="group">
        {({ open }) => (
          <>
            <PopoverButton
              ref={popoverButtonRef}
              className="flex items-center gap-2"
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (!open) {
                  popoverButtonRef.current?.click();
                }
              }}
              onMouseLeave={(e) => {
                if (open) {
                  const groupEl = (e.relatedTarget as Element)?.closest(
                    '[data-headlessui-portal]'
                  );
                  if (!groupEl) {
                    timeoutRef.current = setTimeout(() => {
                      popoverButtonRef.current?.click();
                    }, 300);
                  }
                }
              }}
            >
              {areLocalUpdatesSaved ? (
                <CloudSavedIcon className="w-6 h-6 fill-secondary-500 " />
              ) : (
                <CloudNotSavedIcon className="w-6 h-6 fill-secondary-500" />
              )}

              {/* <ChevronDownIcon className="size-5 group-data-[open]:rotate-180" /> */}
            </PopoverButton>
            <AnimatePresence>
              {open && (
                <PopoverPanel
                  static
                  as={motion.div}
                  anchor="bottom"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${appearance} flex origin-top flex-col`}
                  onMouseEnter={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    if (open) {
                      timeoutRef.current = setTimeout(() => {
                        popoverButtonRef.current?.click();
                      }, 200);
                    }
                  }}
                >
                  <UnsavedChangesComponent
                    areLocalUpdatesSaved={areLocalUpdatesSaved}
                    onDontShowAgain={() => {}}
                    onSave={() => {
                      dispatch(saveBookAction({ bookId: book.id, book: book }));
                    }}
                  />
                </PopoverPanel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </>
  );
};

export default SavePopOver;
