import { ToolbarButton } from '@/module/book/components/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';

import Item from '../Item';
import { lazy, Suspense, useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { useDispatch } from '@/common/store';
import { addElementToPage } from '../../element/Element.action';
import { useParams } from 'react-router';
import { ElementService } from '@/services/element.service';

// Définition des imports lazy pour chaque SVG
const svgs = [
  {
    name: 'Castle',
    component: lazy(() => import('@assets/elements/castle.svg?react')),
    rawContentLoader: () => import('@assets/elements/castle.svg?raw'),
  },
  {
    name: 'Cat',
    component: lazy(() => import('@assets/elements/cat.svg?react')),
    rawContentLoader: () => import('@assets/elements/cat.svg?raw'),
  },
  {
    name: 'Cochon',
    component: lazy(() => import('@assets/elements/cochon.svg?react')),
    rawContentLoader: () => import('@assets/elements/cochon.svg?raw'),
  },
  {
    name: 'Dinosaure',
    component: lazy(() => import('@assets/elements/dinosaure.svg?react')),
    rawContentLoader: () => import('@assets/elements/dinosaure.svg?raw'),
  },
  {
    name: 'Flower',
    component: lazy(() => import('@assets/elements/flower.svg?react')),
    rawContentLoader: () => import('@assets/elements/flower.svg?raw'),
  },
  {
    name: 'Hibou',
    component: lazy(() => import('@assets/elements/hibou.svg?react')),
    rawContentLoader: () => import('@assets/elements/hibou.svg?raw'),
  },
  {
    name: 'Hippocampe',
    component: lazy(() => import('@assets/elements/hippocampe.svg?react')),
    rawContentLoader: () => import('@assets/elements/hippocampe.svg?raw'),
  },
  {
    name: 'Lapin',
    component: lazy(() => import('@assets/elements/lapin.svg?react')),
    rawContentLoader: () => import('@assets/elements/lapin.svg?raw'),
  },
  {
    name: 'Perroquet',
    component: lazy(() => import('@assets/elements/perroquet.svg?react')),
    rawContentLoader: () => import('@assets/elements/perroquet.svg?raw'),
  },
  {
    name: 'Pieuvre',
    component: lazy(() => import('@assets/elements/pieuvre.svg?react')),
    rawContentLoader: () => import('@assets/elements/pieuvre.svg?raw'),
  },
  {
    name: 'Dinosaure2',
    component: lazy(() => import('@assets/elements/dinosaure2.svg?react')),
    rawContentLoader: () => import('@assets/elements/dinosaure2.svg?raw'),
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
              <LazyElementItem svg={svg} pageId={pageId} dispatch={dispatch} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant intermédiaire pour gérer le chargement lazy du rawContent
const LazyElementItem: React.FC<{
  svg: (typeof svgs)[number];
  pageId: number;
  dispatch: ReturnType<typeof useDispatch>;
}> = ({ svg, pageId, dispatch }) => {
  const [rawContent, setRawContent] = useState<string | null>(null);

  useEffect(() => {
    svg.rawContentLoader().then((module) => {
      setRawContent(module.default);
    });
  }, [svg.rawContentLoader]);

  const handleClick = () => {
    if (rawContent) {
      const element = ElementService.createElement({
        type: 'svg',
        attr: { svgContent: rawContent },
        h: 1,
        w: 1,
        x: 0,
        y: 0,
      });
      dispatch(addElementToPage({ element: element, pageId: pageId }));
    }
  };

  return (
    <ElementItem onClick={handleClick}>
      <svg.component className="h-full" />
    </ElementItem>
  );
};

export default ElementContent;
