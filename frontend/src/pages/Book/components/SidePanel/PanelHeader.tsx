import React from 'react';


export const PanelHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={`${className || ''} p-2 text-xs bg-primary-950 font-medium text-primary-500 select-none`}
    >
      {children}
    </div>
  );
};
