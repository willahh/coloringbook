import * as fabric from 'fabric';
import { Element } from '@/types/book';
export interface DrawableElement {
  draw(canvas: fabric.Canvas): void;
  update(attrs: Element): void;
  delete(): void;
  getObject(): Promise<fabric.FabricObject>;
}
