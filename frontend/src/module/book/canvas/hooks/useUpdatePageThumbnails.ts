import { useDispatch } from '@/common/store';
import { Page } from '@/common/types/book';
import canvasService from '@/services/CanvasService';
import { PageService } from '@/services/PageService';
import * as fabric from 'fabric';
import { useEffect, useState } from 'react';
import { updatePageThumbImageData } from '../../BookActions';

const useUpdatePageThumbnails = (
  canvas: fabric.Canvas | null,
  pages: Page[],
  needRedrawPages: boolean
) => {
  const dispatch = useDispatch();
  const [hasInitializedThumbnails, setHasInitializedThumbnails] =
    useState(false);

  /**
   * [Update page thumbnails]
   */
  useEffect(() => {
    
    if (!canvas) return; // Ne s'exécute qu'une seule fois si non initialisé

    const updateThumbnailForPage = async (
      canvas: fabric.Canvas,
      pageId: number
    ) => {
      const page = PageService.getPageById(pages, pageId);
      // console.log('#a updateThumbnailForPage page:', page, canvas);

      if (!canvas.upperCanvasEl) {
        console.error('Canvas not initialized');
      }

      if (page) {
        const pageRect = canvasService.getPageRectbyPageId(canvas, page.pageId);
        // console.log('#a2 pageRect', pageRect);
        if (pageRect) {
          const dimensions = {
            width: 100, // Taille fixe pour la preview
            height: 141,
          };

          // Attendre que les éléments soient dessinés (si besoin)
          setTimeout(async () => {
            const newThumbnail = await canvasService.generatePagePreview(
              page,
              dimensions
            );
            dispatch(
              updatePageThumbImageData({
                thumbnails: { [pageId]: newThumbnail },
              })
            );
            setHasInitializedThumbnails(true); // Marquer comme initialisé
          }, 500);
        }
      }
    };

    // Mettre à jour les vignettes pour toutes les pages
    if (!hasInitializedThumbnails && needRedrawPages === false) {
      for (const page of pages) {
        updateThumbnailForPage(canvas, page.pageId);
      }
    }

    const handleObjectModified = (canvas: fabric.Canvas, pages: Page[]) => {
      // console.log('\n#a3 >>>>> handleObjectModified');
      console.log('#a3 pages[1].elements[0]', pages[1].elements[0]);
      console.log('#a canvas.getObjects():', canvas?.getObjects());
      setTimeout(() => {
        console.log('\n#a3 >>>>> handleObjectModified');
        console.log('#a3 pages[1].elements[0]', pages[1].elements[0]);
        const activeObject = canvas.getActiveObject();
        if (activeObject && 'pageId' in activeObject) {
          // Attendre que les éléments soient dessinés (si besoin)
          console.log('#a 01');
          // await new Promise((resolve) => setTimeout(resolve, 1000)); // Petit délai pour s'assurer que les éléments sont rendus
          console.log('#a 02');
          updateThumbnailForPage(canvas, activeObject.pageId as number);
        }
      }, 500);
    };

    const handleObjectAdded = (/*e: fabric.StaticCanvasEvents*/) => {
      //   const object = e.target as fabric.Object;
      //   if (object && 'pageId' in object) {
      //     // updateThumbnailForPage(object.pageId as number);
      //   }
    };

    const handleObjectRemoved = (/*e: fabric.StaticCanvasEvents*/) => {
      //   const object = e.target as fabric.Object;
      //   if (object && 'pageId' in object) {
      //     // updateThumbnailForPage(object.pageId as number);
      //   }
    };

    //console.log('#a add handler handleObjectModified', 'canvas:', canvas);
    //console.log('#a3 >>>>>> pages[1].elements[0]', pages[1].elements[0]);

    const handleObjectModifiedRef = () => {
      handleObjectModified(canvas, pages);
    };

    // setTimeout(() => {
    canvas.on('object:modified', handleObjectModifiedRef);
    // }, 1000);

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.off('object:modified', handleObjectModifiedRef);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      // updateThumbnailForPage.cancel();
    };
  }, [
    canvas,
    dispatch,
    hasInitializedThumbnails,
    needRedrawPages,
    pages,
  ]);
};
export default useUpdatePageThumbnails;
