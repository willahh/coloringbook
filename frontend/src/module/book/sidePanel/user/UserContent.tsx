import { ToolbarButton } from '@/module/book/components/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';
import GraphicAssets from './../graphicAssets/GraphicAssets';

const UserContent: React.FC = () => {
  return (
    <div>
      {/*
            
            Resize handle

            <Tooltip content="Redimensionner" delayDuration={100}>
              <div
                className={`fixed top-0 -right-3 flex justify-center w-6 h-full z-20 cursor-ew-resize group`}
              >
                <div
                  className={`w-0 h-full flex items-center transition-all ease-in-out duration-300
                group-hover:bg-primary-500 group-hover:w-4 `}
                >
                  <EllipsisVerticalIcon className='w-10 h-10'/>
                </div>
              </div>
            </Tooltip> */}
      <div className="absolute top-4 right-4 flex justify-end">
        <ToolbarButton tooltipContent="Fermer">
          <ArrowDownOnSquareStackIcon />
        </ToolbarButton>
      </div>

      <div>
        <div>Personnel</div>
        <div>Charger</div>
        <div>Charge une image, la convertir en tracé</div>
      </div>
      <GraphicAssets />
    </div>
  );
};

export default UserContent;
