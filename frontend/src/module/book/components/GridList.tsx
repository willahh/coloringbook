import React from 'react';
import ThumbnailItem from './ThumbnailItem'; // Ajustez le chemin

interface GridListItem {
  className?: string;
  name?: string;
  src: string;
  alt?: string;
  onClick?: (item: GridListItem) => void;
}

interface GridListProps {
  className?: string;
  items: GridListItem[];
  renderItem?: (item: GridListItem, index: number) => React.ReactNode;
}

const GridList: React.FC<GridListProps> = ({
  items,
  className = 'sb-grid',
  renderItem,
}) => {
  const getColumnClasses = () => {
    return `grid grid-cols-2 
      @4xs:grid-cols-3
      @sm:grid-cols-4
      @md:grid-cols-6
      @lg:grid-cols-8`;
  };

  const defaultRenderItem = (item: GridListItem, index: number) => (
    <li key={index}>
      <ThumbnailItem
        onClick={() => item.onClick && item.onClick(item)}
        className="relative group"
      >
        <img
          src={item.src}
          width="100"
          loading="lazy"
          alt={item.alt || item.name || `Item ${index}`}
          className="h-full object-contain dark:invert-100"
        />
      </ThumbnailItem>
    </li>
  );

  return (
    <div className={`${className || ''}`}>
      <ul className={`${getColumnClasses()} gap-4 ${className}`}>
        {items.map((item, index) =>
          renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
        )}
      </ul>
    </div>
  );
};

export default GridList;
