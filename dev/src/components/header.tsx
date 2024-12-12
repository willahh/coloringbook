interface HeaderProps {
  className?: string;
}

const Logo = () => (
  <div>
    <div></div>
    <div>Coloring book</div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`p-4 bg-gray-800 h-20 ${className}`}>
      <Logo />
    </header>
  );
};

export default Header;
