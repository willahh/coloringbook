import { ToolbarButton } from '../spreadViewerCanvas/ui/ToolbarButton';
import PointerIcon from '@assets/icons/icon_pointer.svg?react';
import RectangleIcon from '@assets/icons/icon_rectangle.svg?react';
import CircleIcon from '@assets/icons/icon_circle.svg?react';
import TriangleIcon from '@assets/icons/icon_triangle.svg?react';
import TextIcon from '@assets/icons/icon_text.svg?react';

export const SideToolbar: React.FC = () => {
  return (
    <div className="w-20 flex flex-col items-center pt-4 gap-4 border-l border-r border-primary-800">
      <ToolbarButton>
        <PointerIcon
          aria-hidden="true"
          className="size-6 fill-primary-200 group-hover:fill-white group-focus:fill-white"
          style={{
            position: 'relative',
            left: '2px',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <RectangleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <CircleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <TriangleIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
      <ToolbarButton>
        <TextIcon
          aria-hidden="true"
          className="size-6 stroke-primary-200 group-hover:stroke-white group-focus:stroke-white"
          style={{
            fillOpacity: '0',
          }}
        />
      </ToolbarButton>
    </div>
  );
};
