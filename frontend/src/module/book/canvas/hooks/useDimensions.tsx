import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';

export const useDimensions = (
  containerRef: RefObject<HTMLElement | null>,
  sidePanelWidth: number,
  pagesPanelWidth: number
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const viewportHeight = Math.min(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
        const width = window.innerWidth - sidePanelWidth - pagesPanelWidth;
        setDimensions({
          width: width,
          height: viewportHeight - 150,
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
