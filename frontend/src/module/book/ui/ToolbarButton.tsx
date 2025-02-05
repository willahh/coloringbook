import React from 'react';
import { Tooltip } from '@components/Tooltip';

export const ToolbarButtonClassName = (className?: string) => {
  return `rounded-lg w-8 h-8 xl:w-12 xl:h-12 p-1 flex items-center justify-center transition-all duration-300
  text-secondary-950 dark:text-secondary-50 group border border-transparent
  hover:bg-secondary-100 dark:hover:bg-secondary-900 hover:border-secondary-500 hover:scale-110
  focus-visible:outline focus-visible:outline-2 focus-visible:scale-110 focus-visible:outline-offset-2 focus-visible:outline-secondary-400 dark:focus-visible:outline-secondary-600
  ${className || ''}`;
};

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
      className={ToolbarButtonClassName(className)}
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
