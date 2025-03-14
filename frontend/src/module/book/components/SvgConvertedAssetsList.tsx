import { useEffect, useState } from 'react';

import { getAPIURL } from '@/common/utils/api';
import APIService from '@/services/APIService';
import { ElementService } from '@/services/ElementService';
import { useDispatch } from '@/common/store';
import { addElementToPage } from '../element/Element.action';
import { useParams } from 'react-router-dom';
import GridList from './GridList';

interface SvgConvertedAsset {
  name: string;
  file: string;
  thumb: string;
}

const SvgConvertedAssetsList: React.FC = () => {
  const { pageId } = useParams<{ pageId?: string }>();
  const pageIdParam = Number(pageId);
  const dispatch = useDispatch();
  const [svgList, setSvgList] = useState<SvgConvertedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSvgList = async () => {
      try {
        setLoading(true);
        const response = await APIService.fetchSvgConvertedList();
        setSvgList(response);
      } catch {
        setError('Failed to load SVG list');
      } finally {
        setLoading(false);
      }
    };

    loadSvgList();
  }, []);

  const handleClick = async (item: SvgConvertedAsset) => {
    try {
      const svgContent = await APIService.fetchSvgContent(item.file);
      const element = ElementService.createElement({
        type: 'svg',
        attr: { svgContent: svgContent },
        h: 1,
        w: 1,
        x: 0,
        y: 0,
      });
      dispatch(
        addElementToPage({
          element: element,
          pageId: pageIdParam,
        })
      );
    } catch {
      setError('Failed to load SVG content');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="@container">
      <h2>Images vectorisées</h2>
      <GridList
        items={svgList.map((item) => ({
          src: `${getAPIURL()}/image/2png/${item.thumb}`,
          alt: item.name,
          onClick: () => handleClick(item),
        }))}
      />
    </div>
  );
};

export default SvgConvertedAssetsList;
