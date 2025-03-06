import { useMediaQuery } from 'react-responsive';

const useIsMobile = () => {
  return useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)
};

export default useIsMobile;
