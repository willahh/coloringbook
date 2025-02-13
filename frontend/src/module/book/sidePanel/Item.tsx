import { Tooltip } from '@components/Tooltip';

const Item: React.FC<{
  className?: string;
  children: React.ReactNode;
  tooltipContent?: string;
  onClick?: () => void;
}> = ({ className, children, tooltipContent, onClick }) => (
  <button
    data-name="item"
    className={`rounded-lg transition-all cursor-pointer duration-300
      border border-primary-300 dark:border-primary-600
    hover:border-secondary-500
    focus:outline-0 focus:border-secondary-500 
    
    ${className || ''}`}
    onClick={onClick}
  >
    {tooltipContent ? (
      <Tooltip content={tooltipContent}>{children}</Tooltip>
    ) : (
      children
    )}
  </button>
);
export default Item;
