import { motion } from 'motion/react';
import motionConfig from '@/common/utils/config.utils';
import { GridDebug, InterfaceControls } from '@components/Debug';

/**
 * Props for the Layout component.
 *
 * @property {string} [className] - Optional CSS class name to apply to the layout.
 * @property {React.ReactNode} [aside] - Optional aside content to be displayed in the layout.
 * @property {React.ReactNode} [children] - Optional children elements to be rendered within the layout.
 * @property {React.ReactNode} [header] - Optional custom header content to be displayed in the layout.
 */
interface LayoutProps extends React.HTMLAttributes<LayoutProps> {
  className?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  aside,
  children,
  header,
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

      <InterfaceControls />
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
        {header}
      </div>
    </>
  );
};

export default Layout;
