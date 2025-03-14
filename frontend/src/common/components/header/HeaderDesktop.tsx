import Logo from '@assets/coloring-book-logo-wide.svg?react';
import LogoLight from '@assets/coloring-book-logo-wide-light.svg?react';
import { useTheme } from '@/common/contexts/ThemeContext';
import AboutDialog, { getLastBuildText } from './AboutDialog'; // Importez le nouveau composant
import packageJson from '@/../package.json';
import { useAutoOpenDialog } from './useAutoOpenDialog';
import Appearance from '../Appearance';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const LoadingIcon = (
  <svg
    className="mr-3 -ml-1 size-5 animate-spin text-white transition-all"
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

const HeaderDesktop: React.FC<HeaderProps> = ({
  className,
  children,
  isLoading,
}) => {
  const { appearance } = useTheme();
  const appVersion = packageJson.version;

  const { isOpen, setIsOpen } = useAutoOpenDialog();

  return (
    <div className="relative h-0">
      <header
        className={`relative h-32 -top-16 rounded-4xl z-20 ${className} 
         bg-primary-50 dark:bg-primary-950 border-t border-primary-100 dark:border-primary-900 
        `}
      >
        <div className="relative h-16 px-6 flex items-center justify-end gap-4">
          <div className="flex flex-1 flex-row gap-2">{children}</div>

          <div
            className={`flex items-center gap-4 font-mono text-xs py-0.5 px-4 rounded-sm 
              truncate text-nowrap
               text-primary-800 dark:text-primary-200 
              border border-primary-100 dark:border-primary-900/50`}
          >
            <span title="Last build">
              <span className="text-primary-400 font-semibold">[alpha]</span>{' '}
              <span>v{appVersion}</span> <span>⸱</span> last build :{' '}
              {getLastBuildText(new Date(packageJson.buildDate))}
            </span>

            <AboutDialog
              version={appVersion}
              buildDate={packageJson.buildDate}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
          {isLoading && LoadingIcon}
          <Appearance />
          {appearance === 'dark' ? (
            <Logo className="w-24 xl:w-36" />
          ) : (
            <LogoLight className="w-24 xl:w-36" />
          )}
        </div>
      </header>
    </div>
  );
};

export default HeaderDesktop;
