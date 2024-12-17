interface HeaderProps {
  className?: string;
}

const Logo = () => (
  <img className="w-36" src="coloring-book-logo.svg" alt="Logo" />
);

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={`pr-6 h-20 flex items-center justify-end border-t border-indigo-900 ${className} bg-indigo-950`}
      
    >
      <Logo />
    </header>
  );
};

export default Header;
