import { useMediaQuery } from 'react-responsive';

const useIsMobile = () => {
  // return useMediaQuery({ maxWidth: 767 }); // Breakpoint md - 1 (767px)
  return useMediaQuery({ maxWidth: 1024 }); // https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints : @5xl	64rem (1024px)	@container (width >= 64rem) { … }
  // return useMediaQuery({ maxWidth: 896 }); // @4xl - https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints
};

export default useIsMobile;
