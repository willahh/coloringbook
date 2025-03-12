import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';
import useIsMobile from '@/common/hooks/useIsMobile';

export const useDimensions = (
  containerRef: RefObject<HTMLElement | null>
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

        const headerHeight = 64;
        const footerHeight = 64;

        const sidepanel = document.querySelector('aside[data-id="sidepanel"]');
        const sidePanelWidth = sidepanel?.clientWidth || 0;

        const pagesPanel = document.querySelector('div[data-id="pages-panel"]');
        const pagesPanelWidth = pagesPanel?.clientWidth || 0;

        const layerPanel = document.querySelector('div[data-id="layer-panel"]');
        const layerPanelWidth = layerPanel?.clientWidth || 0;

        let width = 0;
        let height = 0;
        if (isMobile) {
          width = window.innerWidth;
          height = viewportHeight - headerHeight - footerHeight;
        } else {
          // Ajoute un offset de 50 en desktop pour compenser la toolbar à gauche
          width = window.innerWidth - sidePanelWidth - pagesPanelWidth - layerPanelWidth - 50;
          height = window.innerHeight;
        }

        console.log(
          `#c updateDimensions -
          isMobile: ${isMobile}
          window.innerWidth: ${window.innerWidth}
          window.innerHeight: ${window.innerHeight}
          sidePanelWidth: ${sidePanelWidth}
          pagesPanelWidth: ${pagesPanelWidth}`,
          {
            width: width,
            height: height,
          }
        );

        setDimensions({
          width: width,
          height: height,
        });
      }
    }, 50),
    [containerRef]
  );

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions, containerRef]);

  return dimensions;
};
