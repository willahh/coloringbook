import { Tooltip } from '@/components/Tooltip';

const Item: React.FC<{
  className?: string;
  children: React.ReactNode;
  tooltipContent?: string;
}> = ({ className, children, tooltipContent }) => (
  <button
    data-name="item"
    className={`rounded-lg border-2 border-primary-500
    hover:border-secondary-500
    focus:outline-0 focus:border-secondary-500 
    transition-all 
    ${className || ''}`}
  >
    {tooltipContent ? (
      <Tooltip content={tooltipContent}>{children}</Tooltip>
    ) : (
      children
    )}
  </button>
);
export default Item;
