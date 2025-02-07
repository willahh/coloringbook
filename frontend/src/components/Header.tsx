import Logo from '@assets/coloring-book-logo-wide.svg?react';
import LogoLight from '@assets/coloring-book-logo-wide-light.svg?react';
import { useTheme } from '@/common/contexts/ThemeContext';

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
  return (
    <header
      className={`px-6 h-10 xl:h-20 flex items-center justify-end border-t border-primary-100 dark:border-primary-900 
        gap-6
        ${className} bg-primary-50 dark:bg-primary-950 z-20`}
    >
      <div className="flex-1">{children}</div>
      {isLoading && LoadingIcon}
      {appearance === 'dark' ? (
        <Logo className="w-24 xl:w-36" />
      ) : (
        <LogoLight className="w-24 xl:w-36" />
      )}
    </header>
  );
};

export default Header;
