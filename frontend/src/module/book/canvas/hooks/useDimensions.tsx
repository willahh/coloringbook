import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';
import useIsMobile from '@/common/hooks/useIsMobile';

export const useDimensions = (
  containerRef: RefObject<HTMLElement | null>,
  sidePanelWidth: number,
  pagesPanelWidth: number
) => {
  const [dimensions, setDimensions] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  const isMobile = useIsMobile();

  const updateDimensions = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const viewportHeight = Math.min(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );

        // Ajoute un offset de 50 en desktop pour compenser la toolbar à gauche
        let offset = 0;
        if (!isMobile) {
          offset = 50;
        }
        const width =
          window.innerWidth - sidePanelWidth - pagesPanelWidth - offset;
        setDimensions({
          width: width,

          /**
           * height: viewportHeight - 64 (height of the bottom toolbar).
           * The height is converted into an offset within the canvas to achieve
           * the toolbar card overlay effect.
           */
          height: viewportHeight,
        });
      }
    }, 50),
    [containerRef, sidePanelWidth, pagesPanelWidth]
  );

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions, containerRef]);

  return dimensions;
};
