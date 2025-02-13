import { ToolbarButton } from '@/module/book/components/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';

import Item from '../Item';
import { lazy, Suspense } from 'react';
import Loader from '@components/Loader';
import { useDispatch } from '@/common/store';
import { addElementToPage } from '../../element/Element.action';
import { useParams } from 'react-router';
import { ElementService } from '@/services/element.service';
const svgs = [
  {
    name: 'Castle',
    component: lazy(() => import('@assets/elements/castle.svg?react')),
    rawContent: await import('@assets/elements/castle.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Cat',
    component: lazy(() => import('@assets/elements/cat.svg?react')),
    rawContent: await import('@assets/elements/cat.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Cochon',
    component: lazy(() => import('@assets/elements/cochon.svg?react')),
    rawContent: await import('@assets/elements/cochon.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Dinosaure',
    component: lazy(() => import('@assets/elements/dinosaure.svg?react')),
    rawContent: await import('@assets/elements/dinosaure.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Flower',
    component: lazy(() => import('@assets/elements/flower.svg?react')),
    rawContent: await import('@assets/elements/flower.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Hibou',
    component: lazy(() => import('@assets/elements/hibou.svg?react')),
    rawContent: await import('@assets/elements/hibou.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Hippocampe',
    component: lazy(() => import('@assets/elements/hippocampe.svg?react')),
    rawContent: await import('@assets/elements/hippocampe.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Lapin',
    component: lazy(() => import('@assets/elements/lapin.svg?react')),
    rawContent: await import('@assets/elements/lapin.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Perroquet',
    component: lazy(() => import('@assets/elements/perroquet.svg?react')),
    rawContent: await import('@assets/elements/perroquet.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Pieuvre',
    component: lazy(() => import('@assets/elements/pieuvre.svg?react')),
    rawContent: await import('@assets/elements/pieuvre.svg?raw').then(
      (m) => m.default
    ),
  },
  {
    name: 'Dinosaure2',
    component: lazy(() => import('@assets/elements/dinosaure2.svg?react')),
    rawContent: await import('@assets/elements/dinosaure2.svg?raw').then(
      (m) => m.default
    ),
  },
];

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <Item
      className={`flex justify-center w-full aspect-square object-cover p-3
        dark:fill-white
    bg-primary-100 dark:bg-primary-800`}
      onClick={onClick}
    >
      {children}
    </Item>
  );
};

const ElementContent: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ pageId?: string }>();
  const pageId = Number(params.pageId);

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
              <ElementItem
                onClick={() => {
                  const element = ElementService.createElement({
                    type: 'svg',
                    attr: { svgContent: svg.rawContent },
                    h: 1,
                    w: 1,
                    x: 0,
                    y: 0,
                  });
                  dispatch(
                    addElementToPage({ element: element, pageId: pageId })
                  );
                }}
              >
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
