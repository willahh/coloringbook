import { ToolbarButton } from '@/module/book/components/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';

import Item from '../Item';
import { lazy, Suspense } from 'react';
import Loader from '@/components/Loader';
const svgs = [
  {
    name: 'Castle',
    component: lazy(() => import('@assets/elements/castle.svg?react')),
  },
  {
    name: 'Cat',
    component: lazy(() => import('@assets/elements/cat.svg?react')),
  },
  {
    name: 'Cochon',
    component: lazy(() => import('@assets/elements/cochon.svg?react')),
  },
  {
    name: 'Dinosaure',
    component: lazy(() => import('@assets/elements/dinosaure.svg?react')),
  },
  {
    name: 'Flower',
    component: lazy(() => import('@assets/elements/flower.svg?react')),
  },
  {
    name: 'Hibou',
    component: lazy(() => import('@assets/elements/hibou.svg?react')),
  },
  {
    name: 'Hippocampe',
    component: lazy(() => import('@assets/elements/hippocampe.svg?react')),
  },
  {
    name: 'Lapin',
    component: lazy(() => import('@assets/elements/lapin.svg?react')),
  },
  {
    name: 'Perroquet',
    component: lazy(() => import('@assets/elements/perroquet.svg?react')),
  },
  {
    name: 'Pieuvre',
    component: lazy(() => import('@assets/elements/pieuvre.svg?react')),
  },
  {
    name: 'Dinosaure2',
    component: lazy(() => import('@assets/elements/dinosaure2.svg?react')),
  },
];

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <Item
      className={`flex justify-center w-full aspect-square object-cover p-3
        dark:fill-white
    bg-primary-100 dark:bg-primary-800`}
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
        <div>Ressources graphiques</div>
        <div className="grid grid-cols-1 @4xs:grid-cols-2 gap-4">
          {svgs.map((svg, index) => (
            <Suspense fallback={<Loader />} key={index}>
              <ElementItem>
                <svg.component className="h-full" />
              </ElementItem>
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementContent;
