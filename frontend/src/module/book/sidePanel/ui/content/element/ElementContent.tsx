import { ToolbarButton } from '@/module/book/ui/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';

import Item from '../../../Item';

// Importation statique des SVG
import Castle from '@assets/elements/castle.svg?react';
import Cat from '@assets/elements/cat.svg?react';
import Cochon from '@assets/elements/cochon.svg?react';
import Dinosaure from '@assets/elements/dinosaure.svg?react';
import Flower from '@assets/elements/flower.svg?react';
import Hibou from '@assets/elements/hibou.svg?react';
import Hippocampe from '@assets/elements/hippocampe.svg?react';
import Lapin from '@assets/elements/lapin.svg?react';
import Perroquet from '@assets/elements/perroquet.svg?react';
import Pieuvre from '@assets/elements/pieuvre.svg?react';
// import Giraffe from '@assets/elements/giraffe.svg?react';
import Dinosaure2 from '@assets/elements/dinosaure2.svg?react';

const svgs = [
  { name: 'Castle', component: Castle },
  { name: 'Cat', component: Cat },
  { name: 'Cochon', component: Cochon },
  { name: 'Dinosaure', component: Dinosaure },
  { name: 'Flower', component: Flower },
  { name: 'Hibou', component: Hibou },
  { name: 'Hippocampe', component: Hippocampe },
  { name: 'Lapin', component: Lapin },
  { name: 'Perroquet', component: Perroquet },
  { name: 'Pieuvre', component: Pieuvre },
  // { name: 'Giraffe', component: Giraffe },
  { name: 'Dinosaure2', component: Dinosaure2 },
];

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <Item
      className={`flex justify-center w-full aspect-square object-cover p-1
    bg-primary-500 `}
    >
      {children}
    </Item>
  );
};

const ElementContent: React.FC = () => {
  return (
    <div>
      <div className="absolute top-4 right-4 flex justify-end">
        <ToolbarButton tooltipContent="Fermer">
          <ArrowDownOnSquareStackIcon />
        </ToolbarButton>
      </div>
      <div className="@container">
        <div>Elements</div>
        <div className="grid grid-cols-1 @4xs:grid-cols-3 gap-4">
          {svgs.map((svg, index) => (
            <ElementItem key={index}>
              <svg.component className="h-full" />
            </ElementItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementContent;
