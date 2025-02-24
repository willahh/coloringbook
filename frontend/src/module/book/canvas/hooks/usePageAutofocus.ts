import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as fabric from 'fabric';

import canvasService from '@/services/canvas.service';
import { BookPageParams } from '@/common/interfaces';

const usePageAutoFocus = (
  canvas: fabric.Canvas | null,
  pageId: number,
  viewportTransform: fabric.TMat2D | undefined
) => {
  const pageParams = useParams<BookPageParams>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvas || !viewportTransform) return;

    const timeoutId = setTimeout(() => {
      canvasService.detectCurrentPage(canvas, (id: number) => {
        if (id !== pageId) {
          if (!canvas.get('scrolling')) {
            navigate(`/book/${pageParams.bookId}/pages/${id}`);
          }
        }
      });
    }, 24);

    return () => clearTimeout(timeoutId);
  }, [canvas, pageId, viewportTransform, navigate, pageParams.bookId]);
};

export default usePageAutoFocus;
