import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';

export const useDimensions = (containerRef: RefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const viewportHeight = Math.min(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
        setDimensions({
          width:
            window.innerWidth - containerRef.current.getBoundingClientRect().x,
          height: viewportHeight - 150,
        });
      }
    }, 200),
    [containerRef]
  );

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions, containerRef]);

  return dimensions;
};
