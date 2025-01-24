import React from 'react';

export const MainPage: React.FC<{ className?: string; idx: number; }> = ({
  className, idx,
}) => {
  return (
    <div
      data-name="MainPage"
      className={`${className || ''} flex flex-col`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '210 / 297',
      }}
    >
      <div
        data-name="bg"
        className={`flex-1 bg-white border border-primary-500
          rounded-lg overflow-hidden
          ring-2 ring-inset ring-gray-300 
           snap-center`}
      ></div>
      <div data-name="pageCount" className="text-white text-sm select-none">
        Page {idx} / 12
      </div>
    </div>
  );
};
