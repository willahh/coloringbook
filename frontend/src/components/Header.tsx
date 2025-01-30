import Logo from '@assets/coloring-book-logo-wide.svg?react';
interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ className, children }) => {
  return (
    <header
      className={`pr-6 h-20 flex items-center justify-end border-t border-primary-100 dark:border-primary-900 
        ${className} bg-primary-50 dark:bg-primary-950 z-20`}
    >
      <div className="flex-1 pl-6">{children}</div>
      <Logo className="w-36" />
    </header>
  );
};

export default Header;
