import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

import packageJson from '@/../package.json';
import Appearance from '../Appearance';
import AboutDialog from './AboutDialog'; // Importez le nouveau composant
import { useAutoOpenDialog } from './useAutoOpenDialog';
import { footerButtonClasses } from '@/common/utils/buttonStyles';
import MobileSidebarMenu from '../MobileSidebarMenu';

interface FooterMobileProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const LoadingIcon = (
  <svg
    className="size-5 animate-spin text-primary-800 dark:text-primary-200 transition-all"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const HeaderMobile: React.FC<FooterMobileProps> = ({
  className,
  children,
  isLoading,
}) => {
  const appVersion = packageJson.version;
  const { isOpen, setIsOpen } = useAutoOpenDialog();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // isLoading = true;
  return (
    <>
      <header
        data-id="header-mobile"
        className={`${className} 
         bg-primary-50 dark:bg-primary-950 border-b border-primary-100 dark:border-primary-900 
        `}
      >
        <div className="p-2 flex items-center justify-end gap-2">
          <button
            className={`${footerButtonClasses}`}
            autoFocus={true}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex flex-row flex-1 gap-2">{children}</div>
          <div className="flex w-10 h-10 items-center justify-center border-red-100">
            {isLoading && LoadingIcon}
          </div>
          <AboutDialog
            version={appVersion}
            buildDate={packageJson.buildDate}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />

          <Appearance />
        </div>
      </header>
      <MobileSidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default HeaderMobile;
