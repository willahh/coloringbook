import { DrawableObject } from '../DrawableObject';
import * as fabric from 'fabric';
import { isTextObject, ObjectAttributes } from '@/domain/book';

export class Text implements DrawableObject {
  private text: fabric.Text;

  constructor(attrs: ObjectAttributes, relativeX: number, relativeY: number) {
    if (isTextObject(attrs)) {
      this.text = new fabric.Text(attrs.text.text, {
        left: relativeX,
        top: relativeY,
        fontSize: attrs.text.fontSize,
        textAlign: attrs.text.textAlign,
        fill: attrs.text.color,
      });
    } else {
      throw new Error(
        'Attributes do not match expected shape object properties'
      );
    }
  }

  getObject(): fabric.Object {
    return this.text;
  }

  draw(canvas: fabric.Canvas): fabric.Object {
    // canvas.add(this.text);
    console.log('draw', canvas);
    return this.text;
  }

  update(attrs: ObjectAttributes): void {
    this.text.set(attrs);
  }

  delete(): void {
    // this.circle.remove();
  }
}
