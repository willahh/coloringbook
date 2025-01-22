import React from 'react';

export const MainSpread: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div data-name="MainSpread" className={`${className || ''}  flex`}>
      {children}
    </div>
  );
};
