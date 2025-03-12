import Item from '../sidePanel/Item';
import { Suspense, useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { useDispatch } from '@/common/store';
import { addElementToPage } from '../element/Element.action';
import { useParams } from 'react-router';
import { ElementService } from '@/services/ElementService';
import { HeartIcon } from '@heroicons/react/20/solid';
import { getAPIURL } from '@/common/utils/api';

const ElementItem: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick, className }) => {
  return (
    <Item
      className={`flex justify-center w-full aspect-square object-cover p-2
        dark:fill-white
        bg-primary-100 dark:bg-primary-700 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Item>
  );
};

const LazyElementItem: React.FC<{
  svg: (typeof svgs)[number];
  pageId: number;
  dispatch: ReturnType<typeof useDispatch>;
}> = ({ svg, pageId, dispatch }) => {
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSvgContent = async () => {
      try {
        const response = await fetch(
          `${getAPIURL()}/image/svg-content/${svg.file}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch SVG content: ${response.statusText}`
          );
        }
        const content = await response.text();
        setRawContent(content);
      } catch (err) {
        setError((err as Error).message);
        console.error(`Error fetching SVG content for ${svg.file}:`, err);
      }
    };

    fetchSvgContent();
  }, [svg.file]);

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

  if (error) {
    return (
      <div>
        Error loading {svg.name}: {error}
      </div>
    );
  }

  return (
    <ElementItem onClick={handleClick} className="relative group">
      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <HeartIcon className="w-4 h-4 text-pink-500" />
      </button>
      <img
        src={`${getAPIURL()}/image/2png/${svg.file}`}
        loading="lazy"
        alt={svg.name}
        className="h-full object-contain"
      />
    </ElementItem>
  );
};

const AssetList: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useDispatch();
  const params = useParams<{ pageId?: string }>();
  const pageId = Number(params.pageId);

  const svgs = [
    { name: 'Castle', file: 'castle.svg' },
    { name: 'Cat', file: 'cat.svg' },
    { name: 'Cochon', file: 'cochon.svg' },
    { name: 'Dinosaure', file: 'dinosaure.svg' },
    { name: 'Flower', file: 'flower.svg' },
    { name: 'Hibou', file: 'hibou.svg' },
    { name: 'Hippocampe', file: 'hippocampe.svg' },
    { name: 'Lapin', file: 'lapin.svg' },
    { name: 'Perroquet', file: 'perroquet.svg' },
    { name: 'Pieuvre', file: 'pieuvre.svg' },
    { name: 'Dinosaure2', file: 'dinosaure2.svg' },
  ];

  return (
    <div className="flex flex-col @container h-full">
      <div>{title}</div>
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        <div className="grid grid-cols-1 @4xs:grid-cols-3 gap-4">
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

export default AssetList;
