import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { debounce } from 'lodash';

import canvasService from '@/services/CanvasService';
import { BookPageParams } from '@/common/interfaces';
// import useCanvasContext from '../../useCanvasContext';

const usePageAutoFocus = (
  canvas: fabric.Canvas | null,
  pageId: number,
  viewportTransform: fabric.TMat2D | undefined
) => {
  const [disableFocusAnimation, setDisableFocusAnimation] = useState(false);

  //   const { viewportTransform } = useCanvasContext();
  const pageParams = useParams<BookPageParams>();
  const navigate = useNavigate();

  // Créer une version mémorisée du debouncer avec useCallback
  const debouncedDetectPage = useCallback(
    debounce((canvas: fabric.Canvas, callback: (id: number) => void) => {
      canvasService.detectCurrentPage(canvas, callback);
    }, 400),
    [] // Pas de dépendances, car le debouncer ne change pas
  );

  // Fonction pour naviguer avec animation (par défaut)
  // const navigateWithAnimation = (newPageId: number) => {
  //   navigate(`/book/${pageParams.bookId}/pages/${newPageId}`);
  // };

  // Fonction pour naviguer sans animation
  const navigateWithoutAnimation = (newPageId: number) => {
    setDisableFocusAnimation(true); // Désactiver l'animation temporairement
    navigate(`/book/${pageParams.bookId}/pages/${newPageId}`, {
      replace: true, // Replace: true pour ne pas surcharger l'historique de navigation du navigateur
    });

    // Réactiver l'animation après un court délai (par exemple, 500ms)
    setTimeout(() => setDisableFocusAnimation(false), 500);
  };

  useEffect(() => {
    if (!canvas || !viewportTransform) return;
    debouncedDetectPage(canvas, (id: number) => {
      const isDifferentPageId = id !== pageId;
      const isZoomWithinPageRange =
        canvas.getZoom() > 0.4 && canvas.getZoom() < 1.8;
      const isNotScrolling = !canvas.get('scrolling');

      if (isDifferentPageId && isNotScrolling) {
        if (isZoomWithinPageRange) {
          // Mise à jour suite utilisation, pour ne jamais prender la main
          // sur l'utilisateur ... beaucoup trop chiant
          // navigateWithAnimation(id);
          navigateWithoutAnimation(id);
        } else {
          navigateWithoutAnimation(id);
        }
      }
    });

    return () => {
      debouncedDetectPage.cancel(); // Cleanup pour le debouncer
    };
  }, [canvas, pageId, viewportTransform, navigate, pageParams.bookId]);

  return {
    disableFocusAnimation,
  };
};

export default usePageAutoFocus;
