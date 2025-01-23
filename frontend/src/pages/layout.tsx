import motionConfig from '@/shared/shared';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { GridDebug, DebugButton } from './Debug';

interface LayoutProps {
  className?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  aside,
  children,
  showHeader,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const griddDebug = urlParams.get('griddebug') === '1';

  return (
    <>
      <div
        id="focus-trap"
        tabIndex={0}
        aria-hidden="true"
        className="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none  z-10 text-white focus:border focus:border-white"
      ></div>

      <DebugButton />
      {griddDebug && <GridDebug />}
      <div
        data-id="page-layout-container"
        className={`flex flex-col min-h-screen`}
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        <motion.div
          data-id="page-layout"
          className={`flex flex-1 ${className || ''}`}
          {...motionConfig}
          aria-live="polite"
        >
          {aside}
          {children}
        </motion.div>
        {showHeader && <Header />}
      </div>
    </>
  );
};

export default Layout;
