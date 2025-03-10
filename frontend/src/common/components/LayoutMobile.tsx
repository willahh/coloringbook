import { motion } from 'motion/react';
import motionConfig from '@/common/utils/ConfigUtils';
import { GridDebug } from '@components/Debug';

interface LayoutMobileProps extends React.HTMLAttributes<LayoutMobileProps> {
  className?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const LayoutMobile: React.FC<LayoutMobileProps> = ({
  className,
  aside,
  children,
  header,
  footer,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const griddDebug = urlParams.get('griddebug') === '1';

  return (
    <>
      <div
        id="focus-trap"
        tabIndex={0}
        aria-hidden="true"
        className={`absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none  z-10
         dark:text-white focus:border focus:border-black dark:focus:border-white`}
      ></div>

      {griddDebug && <GridDebug />}
      <div
        data-id="page-layout-container"
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        {header}
        <motion.div
          data-id="page-layout"
          className={`flex flex-1 ${className || ''}`}
          {...motionConfig}
          aria-live="polite"
        >
          {aside}
          {children}
        </motion.div>
        {footer}
      </div>
    </>
  );
};

export default LayoutMobile;
