import * as fabric from 'fabric';
import { Element } from '@/domain/book';
export interface DrawableObject {
  draw(canvas: fabric.Canvas): void;
  update(attrs: Element): void;
  delete(): void;
  getObject(): Promise<fabric.FabricObject>;
}
