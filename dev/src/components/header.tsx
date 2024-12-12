interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`p-4 col-span-3 bg-gray-800 h-20 ${className}`}>
      Header
    </header>
  );
};

export default Header;
