import * as fabric from 'fabric';

export type BookPageParams = {
  bookId?: string;
  pageId?: string;
};

export type PageDimensions = {
  width: number;
  height: number;
};

export interface FabricRectPage extends fabric.Rect {
  pageId?: number;
}

export interface PageFabricObject extends fabric.Object {
  isPage?: boolean;
  pageId: number;
}
