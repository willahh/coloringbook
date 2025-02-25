import Logo from '@assets/coloring-book-logo-wide.svg?react';
import LogoLight from '@assets/coloring-book-logo-wide-light.svg?react';
import { useTheme } from '@/common/contexts/ThemeContext';
import { useSelector } from '../../store';
import { selectBook } from '@/module/book/Book.slice';

import SavePopOver from './SavePopOver';

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

const Header: React.FC<HeaderProps> = ({ className, children, isLoading }) => {
  const { appearance } = useTheme();
  const { areLocalUpdatesSaved } = useSelector(selectBook);

  return (
    <div className="relative h-0">
      <header
        className={`relative h-32 -top-16 rounded-4xl z-20 ${className} 
         bg-primary-50 dark:bg-primary-950 border-t border-primary-100 dark:border-primary-900 
        `}
      >
        <div className="relative h-16 px-6 flex items-center justify-end gap-6">
          <div className="flex-1">{children}</div>

          <div className="text-xs text-primary-500 dark:text-primary-500">
            <a
              href="https://williamravel.netlify.app"
              className="underline"
              target="_blank"
            >
              williamravel.netlify.app
            </a>
          </div>
          <SavePopOver areLocalUpdatesSaved={areLocalUpdatesSaved} />
          {isLoading && LoadingIcon}
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

export default Header;
