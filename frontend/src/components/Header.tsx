import Logo from '@assets/coloring-book-logo-wide.svg?react';
import LogoLight from '@assets/coloring-book-logo-wide-light.svg?react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children }) => {
  const { appearance } = useTheme();
  return (
    <header
      className={`pr-6 h-10 xl:h-20 flex items-center justify-end border-t border-primary-100 dark:border-primary-900 
        ${className} bg-primary-50 dark:bg-primary-950 z-20`}
    >
      <div className="flex-1 pl-6">{children}</div>
      {appearance === 'dark' ? (
        <Logo className="w-24 xl:w-36" />
      ) : (
        <LogoLight className="w-24 xl:w-36" />
      )}
    </header>
  );
};

export default Header;
