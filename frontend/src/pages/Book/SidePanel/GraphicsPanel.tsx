import React from 'react';
import { PanelHeader } from './PanelHeader';

export const GraphicsPanel: React.FC<{ className?: string; }> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <PanelHeader>GraphicsPanel</PanelHeader>
      <div className="p-2 text-xs"></div>
    </div>
  );
};
