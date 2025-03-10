import { ToolbarButton } from '@/module/book/components/ToolbarButton';
import { ArrowDownOnSquareStackIcon } from '@heroicons/react/24/outline';

import Item from '../Item';
import { Suspense, useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { useDispatch } from '@/common/store';
import { addElementToPage } from '../../element/Element.action';
import { useParams } from 'react-router';
import { ElementService } from '@/services/ElementService';
import { HeartIcon } from '@heroicons/react/20/solid';
import { getAPIURL } from '@/common/utils/api';

// Liste des SVG (sans les imports de composants React)
const svgs = [
  {
    name: 'Castle',
    file: 'castle.svg',
    rawContentLoader: () => import('@assets/elements/castle.svg?raw'),
  },
  {
    name: 'Cat',
    file: 'cat.svg',
    rawContentLoader: () => import('@assets/elements/cat.svg?raw'),
  },
  {
    name: 'Cochon',
    file: 'cochon.svg',
    rawContentLoader: () => import('@assets/elements/cochon.svg?raw'),
  },
  {
    name: 'Dinosaure',
    file: 'dinosaure.svg',
    rawContentLoader: () => import('@assets/elements/dinosaure.svg?raw'),
  },
  {
    name: 'Flower',
    file: 'flower.svg',
    rawContentLoader: () => import('@assets/elements/flower.svg?raw'),
  },
  {
    name: 'Hibou',
    file: 'hibou.svg',
    rawContentLoader: () => import('@assets/elements/hibou.svg?raw'),
  },
  {
    name: 'Hippocampe',
    file: 'hippocampe.svg',
    rawContentLoader: () => import('@assets/elements/hippocampe.svg?raw'),
  },
  {
    name: 'Lapin',
    file: 'lapin.svg',
    rawContentLoader: () => import('@assets/elements/lapin.svg?raw'),
  },
  {
    name: 'Perroquet',
    file: 'perroquet.svg',
    rawContentLoader: () => import('@assets/elements/perroquet.svg?raw'),
  },
  {
    name: 'Pieuvre',
    file: 'pieuvre.svg',
    rawContentLoader: () => import('@assets/elements/pieuvre.svg?raw'),
  },
  {
    name: 'Dinosaure2',
    file: 'dinosaure2.svg',
    rawContentLoader: () => import('@assets/elements/dinosaure2.svg?raw'),
  },
];

const API_BASE_URL = getAPIURL();

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick, className }) => {
  return (
    <Item
      className={`flex justify-center w-full aspect-square object-cover p-2
        dark:fill-white
        bg-primary-100 dark:bg-primary-800 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Item>
  );
};

const ElementTabContent: React.FC = () => {
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
    <ElementItem onClick={handleClick} className="relative group">
      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <HeartIcon className="w-4 h-4 text-pink-500" />
      </button>
      <img
        src={`${API_BASE_URL}/image/2png/${svg.file}`}
        alt={svg.name}
        className="h-full object-contain"
      />
    </ElementItem>
  );
};

export default ElementTabContent;
