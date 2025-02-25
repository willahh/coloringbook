import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRef } from 'react';
import { UnsavedChangesComponent } from '@/module/book/components/UnchangedModificationsToast';
import { useTheme } from '@/common/contexts/ThemeContext';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface SavePopOverProps {
  areLocalUpdatesSaved: boolean;
}
const SavePopOver: React.FC<SavePopOverProps> = ({ areLocalUpdatesSaved }) => {
  const popoverButtonRef = useRef<HTMLButtonElement>(null);
  const { appearance } = useTheme();

  return (
    <>
      {!areLocalUpdatesSaved && (
        <Popover className={`group`}>
          {({ open }) => (
            <>
              <PopoverButton
                ref={popoverButtonRef}
                className="flex items-center gap-2"
                onMouseEnter={() => {
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
                      popoverButtonRef.current?.click();
                    }
                  }
                }}
              >
                <CloudArrowUpIcon className="w-6 h-6 stroke-secondary-500" />
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

                    // PopoverPanel is rendered outside body and is not aware of the appearance
                    // ("dark", "light") css class, so we add it here.
                    // We also re-apply text-[12px] because it is also defined on the body.
                    className={`${appearance} text-[12px] flex origin-top flex-col`}
                    onMouseLeave={({ target }) => {
                      if (open) {
                        popoverButtonRef.current?.click();
                      }
                    }}
                  >
                    <UnsavedChangesComponent
                      isModified={!areLocalUpdatesSaved}
                      onDontShowAgain={() => {}}
                      onSave={() => {}}
                    />
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </>
          )}
        </Popover>
      )}
    </>
  );
};

export default SavePopOver;
