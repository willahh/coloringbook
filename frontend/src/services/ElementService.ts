import fabric from 'fabric';
import { IBook, Obj } from '@/domain/book';
import { PageService } from './PageService';
import { GraphicAsset } from '@/domain/graphic-asset.entity';
import { GraphicAssetType } from '@/domain/graphic-asset-type.enum';

export class ElementService {
  public static elementFromGraphicAsset(asset: GraphicAsset): Obj | null {
    let element = null;
    // if (asset.type === GraphicAssetType.CONVERTED_SVG) {
    if (asset.type === GraphicAssetType.SVG) {
      element = {
        type: 'svg',
        w: 50,
        h: 50,
        x: 10,
        y: 10,
        attr: { svgURL: asset.vectPath },
        //   attr: { imageData: asset.vectPath },
        //   attr: { svgContent: asset.vectPath },
        //   attr: { svgContent: `<svg viewBox="0 0 100 125" role="img" aria-labelledby="svgTitle svgDescription"> <title id="svgTitle">Manual</title> <desc id="svgDescription"> A nondescript twelve page booklet opened to the middle page </desc> <defs> <style> rect { fill: #cccccc; stroke: #666; transform-origin: top; } </style> </defs> <rect width="36" height="60" x="13" y="18" ry="2" style="transform: skewy(24deg)" /> <rect width="39" height="60" x="11" y="20" ry="2" style="transform: skewy(18deg)" /> <rect width="42" height="90" x="8" y="22" ry="2" style="transform: skewy(12deg)" /> <rect width="36" height="60" x="50" y="18" ry="2" style="transform: skewy(-24deg)" /> <rect width="39" height="60" x="50" y="20" ry="2" style="transform: skewy(-18deg)" /> <rect width="42" height="90" x="50" y="22" ry="2" style="transform: skewy(-12deg)" /> </svg>` },
      } as Obj;
    }
    console.log('#3 elementFromGraphicAsset')
    console.log('#3 asset', asset)
    console.log('#3 element', element)

    return element;
  }
  public static add(book: IBook, element: Obj, pageId: number): IBook {
    const updatedBook = { ...book };
    const pageIndex = updatedBook.pages.findIndex(
      (page) => page.pageId === pageId
    );
    if (pageIndex !== -1) {
      // Si la page est trouvée, créez une nouvelle page avec les éléments mis à jour
      const updatedPage = {
        ...updatedBook.pages[pageIndex],
        elements: [...updatedBook.pages[pageIndex].elements, element],
      };

      // Mettez à jour le tableau des pages avec la nouvelle version de la page
      updatedBook.pages = [
        ...updatedBook.pages.slice(0, pageIndex),
        updatedPage,
        ...updatedBook.pages.slice(pageIndex + 1),
      ];
    } else {
      console.warn(`Page with id ${pageId} not found.`);
    }

    return updatedBook;
  }
}
