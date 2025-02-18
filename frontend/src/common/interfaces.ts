import * as fabric from 'fabric';

export type BookPageParams = {
  bookId?: string;
  pageId?: string;
};

export type PageDimensions = {
  width: number;
  height: number;
};

export interface fabricRectPage extends fabric.Rect {
  pageId?: number;
}

export interface IPageFabricObject extends fabric.Object {
  isPage: boolean;
}