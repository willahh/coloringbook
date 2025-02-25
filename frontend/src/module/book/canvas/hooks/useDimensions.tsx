import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';

export const useDimensions = (
  containerRef: RefObject<HTMLElement | null>,
  sidePanelWidth: number,
  pagesPanelWidth: number
) => {
  const [dimensions, setDimensions] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  const updateDimensions = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const viewportHeight = Math.min(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
        const width = window.innerWidth - sidePanelWidth - pagesPanelWidth - 50;
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
