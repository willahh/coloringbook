import React from 'react';
// import { Tooltip } from '@radix-ui/themes';
import { Tooltip } from '@components/Tooltip';

export const ToolbarButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
  tooltipContent?: string;
  onClick?: (event: React.MouseEvent) => void;
}> = ({ className, children, tooltipContent, onClick }) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg w-12 h-12 p-1 flex items-center justify-center transition-all
text-white group border border-transparent
hover:bg-primary-900  hover:border-primary-500
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600
${className}`}
    >
      {children}
    </button>
  );

  return tooltipContent && tooltipContent !== '' ? (
    <Tooltip content={tooltipContent}>{button}</Tooltip>
  ) : (
    button
  );
};
