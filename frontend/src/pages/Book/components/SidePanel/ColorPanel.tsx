import React from 'react';
import { PanelHeader } from './PanelHeader';

export const ColorPanel: React.FC<{ className?: string; }> = () => {
  return (
    <div>
      <PanelHeader>Couleurs</PanelHeader>
      <div className="grid grid-cols-4 gap-4 p-4 text-xs">
        <div className="w-12 h-7 bg-red-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-yellow-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-blue-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-green-500 rounded-md border-2 border-primary-700"></div>
        <div className="w-12 h-7 bg-orange-500 rounded-md border-2 border-primary-700"></div>
      </div>
    </div>
  );
};
