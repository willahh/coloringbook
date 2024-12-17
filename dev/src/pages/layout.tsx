import motionConfig from '@/shared/shared'; // FIXME/ import from '@shared/shared' doesn't work
import { motion } from 'motion/react';
import Header from '@/components/Header';

interface LayoutProps {
  className?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ className, aside, children }) => {
  return (
    <div className={`flex flex-col min-h-screen`}>
      {/* <div className="spot spot-1" /> */}
      {/* <div className="spot spot-2" /> */}
      <motion.div
        className={`flex flex-1 ${className || ''}`}
        {...motionConfig}
      >
        {aside}
        {children}
      </motion.div>
      <Header />
    </div>
  );
};

export default Layout;
