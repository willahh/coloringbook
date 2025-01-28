import Logo from '@assets/coloring-book-logo-wide.svg?react';
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={`pr-6 h-20 flex items-center justify-end border-t border-primary-100 dark:border-primary-900 
        ${className} bg-primary-50 dark:bg-primary-950 z-20`}
    >
      <Logo className="w-36" />
    </header>
  );
};

export default Header;
