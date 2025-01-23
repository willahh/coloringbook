import React from 'react';
import { Tooltip } from '@radix-ui/themes';

export const ToolbarButton: React.FC<{
  children?: React.ReactNode;
  tooltipContent?: string;
  onClick?: () => void;
}> = ({ children, tooltipContent, onClick }) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg w-12 h-12 p-1 flex items-center justify-center transition-all
text-white group border border-transparent
hover:bg-primary-900  hover:border-primary-500
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
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
