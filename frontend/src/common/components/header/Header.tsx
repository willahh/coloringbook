import HeaderMobile from './HeaderMobile';
import HeaderDesktop from './HeaderDesktop';
import { useMediaQuery } from 'react-responsive';
interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className, children, isLoading }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)

  if (isMobile) {
    return (
      <HeaderMobile className={className} isLoading={isLoading}>
        {children}
      </HeaderMobile>
    );
  } else {
    return (
      <HeaderDesktop className={className} isLoading={isLoading}>
        {children}
      </HeaderDesktop>
    );
  }
};

export default Header;
