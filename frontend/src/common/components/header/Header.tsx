import HeaderMobile from './HeaderMobile';
import HeaderDesktop from './HeaderDesktop';
import useIsMobile from '@/common/hooks/useIsMobile';
interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className, children, isLoading }) => {
  const isMobile = useIsMobile();

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
