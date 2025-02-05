import React from 'react';

export const SidePanel: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return <aside className={`${className || ''}`}>{children}</aside>;
};
