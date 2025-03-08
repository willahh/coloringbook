import FooterMobile from './FooterMobile';
import FooterDesktop from './FooterDesktop';
import useIsMobile from '@/common/hooks/useIsMobile';
interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

const Footer: React.FC<HeaderProps> = ({ className, children, isLoading }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <FooterMobile className={className} isLoading={isLoading}>
        {children}
      </FooterMobile>
    );
  } else {
    return (
      <FooterDesktop className={className} isLoading={isLoading}>
        {children}
      </FooterDesktop>
    );
  }
};

export default Footer;
