import { Tooltip } from '@components/Tooltip';

const ThumbnailItem: React.FC<{
  className?: string;
  children: React.ReactNode;
  tooltipContent?: string;
  onClick?: () => void;
}> = ({ className, children, tooltipContent, onClick }) => (
  <button
    data-name="item"
    className={`rounded-lg transition-all cursor-pointer duration-300
      flex justify-center w-full aspect-square object-cover p-2
      border border-transparent
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
export default ThumbnailItem;
