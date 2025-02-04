import { ToolbarButton } from '../ToolbarButton';
import PointerIcon from '@assets/icons/icon_pointer.svg?react';
import RectangleIcon from '@assets/icons/icon_rectangle.svg?react';
import CircleIcon from '@assets/icons/icon_circle.svg?react';
import TriangleIcon from '@assets/icons/icon_triangle.svg?react';
import TextIcon from '@assets/icons/icon_text.svg?react';

interface SideToolbarProps {
  onRectangleClick: () => void;
}

export const SideToolbar: React.FC<SideToolbarProps> = ({
  onRectangleClick,
}) => {
  return (
    <div
      data-id="side-toolbar"
      className="w-20 flex flex-col items-center pt-4 gap-4 border-l border-r border-primary-200 dark:border-primary-800"
    >
      <ToolbarButton tooltipContent="Pointer">
        <PointerIcon
          aria-hidden="true"
          className={`size-6 fill-secondary-800 group-hover:fill-black group-focus:fill-black
            dark:fill-secondary-200 dark:group-hover:fill-white dark:group-focus:fill-white`}
          style={{
            position: 'relative',
            left: '2px',
          }}
        />
      </ToolbarButton>
      <ToolbarButton
        tooltipContent="Rectangle"
        onClick={() => {
          onRectangleClick();
        }}
      >
        <RectangleIcon
          aria-hidden="true"
          className={`size-6 
            stroke-secondary-800 group-hover:stroke-secondary-950 group-focus:stroke-secondary-950
            dark:stroke-secondary-200 dark:group-hover:stroke-white dark:group-focus:stroke-white`}
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton tooltipContent="Cercle">
        <CircleIcon
          aria-hidden="true"
          className={`size-6 
            stroke-secondary-800 group-hover:stroke-secondary-950 group-focus:stroke-secondary-950
            dark:stroke-secondary-200 dark:group-hover:stroke-white dark:group-focus:stroke-white`}
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton tooltipContent="Triangle">
        <TriangleIcon
          aria-hidden="true"
          className={`size-6 
            stroke-secondary-800 group-hover:stroke-secondary-950 group-focus:stroke-secondary-950
            dark:stroke-secondary-200 dark:group-hover:stroke-white dark:group-focus:stroke-white`}
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton tooltipContent="Texte">
        <TextIcon
          aria-hidden="true"
          className={`size-6 
            stroke-secondary-800 group-hover:stroke-secondary-950 group-focus:stroke-secondary-950
            dark:stroke-secondary-200 dark:group-hover:stroke-white dark:group-focus:stroke-white`}
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
    </div>
  );
};
