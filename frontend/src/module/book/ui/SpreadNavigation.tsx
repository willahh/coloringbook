import { Tooltip } from '@/components/Tooltip';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export const SpreadNavigation: React.FC = () => {
  return (
    <>
      <div className="absolute left-0 flex items-center justify-between h-full p-8 z-10">
        <Tooltip content="Page précédente">
          <button
            className={`w-12 h-12 rounded-full z-10 p-2 
          text-primary-800 dark:text-primary-200
           transition-all duration-400
         hover:ring-1 
         hover:bg-primary-50  hover:ring-primary-200
         dark:hover:bg-primary-950  dark:hover:ring-primary-800 
         active:ring-primary-950 dark:active:ring-primary-50
          `}
          >
            <ArrowLeftIcon />
          </button>
        </Tooltip>
      </div>
      <div className="absolute right-0 flex items-center justify-between h-full p-8 z-10">
        <Tooltip content="Page suivante">
          <button
            className={`w-12 h-12 rounded-full z-10 p-2 
              text-primary-800 dark:text-primary-200
               transition-all duration-400
             hover:ring-1 
             hover:bg-primary-50  hover:ring-primary-200
             dark:hover:bg-primary-950  dark:hover:ring-primary-800 
             active:ring-primary-950 dark:active:ring-primary-50
              `}
          >
            <ArrowRightIcon />
          </button>
        </Tooltip>
      </div>
    </>
  );
};
