import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isTextObject, Obj } from '@/domain/book';

export class Text implements DrawableObject {
  private text: fabric.Text;

  constructor(obj: Obj, relativeX: number, relativeY: number) {
    if (isTextObject(obj)) {
      this.text = new fabric.Text(obj.attr.text, {
        left: relativeX,
        top: relativeY,
        fontSize: obj.attr.fontSize,
        textAlign: obj.attr.textAlign,
        fill: obj.attr.color,
      });
    } else {
      throw new Error(
        'Attributes do not match expected shape object properties'
      );
    }
  }

  async getObject(): Promise<fabric.Object> {
    return this.text;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    // canvas.add(this.text);
    console.log('draw', canvas);
    return this.text;
  }

  update(attrs: Obj): void {
    this.text.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
