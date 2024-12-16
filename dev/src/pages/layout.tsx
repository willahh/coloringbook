import motionConfig from '../shared/shared'; // FIXME/ import from '@shared/shared' doesn't work
import './layout.css';
import { motion } from 'motion/react';

interface LayoutProps {
  header: React.ReactNode;
  main: React.ReactNode;
  side: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, main, side }) => {
  return (
    <motion.div className="flex flex-col min-h-screen" {...motionConfig}>
      <div className="flex flex-1">
        {side}
        {main}
      </div>
      {header}
    </motion.div>
  );
};

export default Layout;
