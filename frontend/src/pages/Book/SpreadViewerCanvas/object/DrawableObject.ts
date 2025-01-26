import * as fabric from 'fabric';
import { Obj } from '@/domain/book';
export interface DrawableObject {
  draw(canvas: fabric.Canvas): void;
  update(attrs: Obj): void;
  delete(): void;
  getObject(): fabric.Object;
}
