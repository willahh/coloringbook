import motionConfig from '@/shared/shared'; // FIXME/ import from '@shared/shared' doesn't work
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { GridDebug, DebugButton } from './Debug';

interface LayoutProps {
  className?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ className, aside, children }) => {
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
      <div className={`flex flex-col min-h-screen`}>
        <motion.div
          className={`flex flex-1 ${className || ''}`}
          {...motionConfig}
          aria-live="polite"
        >
          {aside}
          {children}
        </motion.div>
        <Header />
      </div>
    </>
  );
};

export default Layout;
