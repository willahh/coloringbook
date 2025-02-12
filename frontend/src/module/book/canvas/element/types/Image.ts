import { DrawableElement } from '../DrawableElement';
import * as fabric from 'fabric';
import { ImageElement } from '@/types/book';
// import { getMediaUrl } from '@/utils/api';

export class Image implements DrawableElement {
  private img: Promise<fabric.FabricObject> | null;

  constructor(
    obj: ImageElement,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ) {
    this.img = this.createImage(
      obj,
      relativeX,
      relativeY,
      relativeW,
      relativeH
    );
  }

  private async createImage(
    obj: ImageElement,
    relativeX: number,
    relativeY: number,
    relativeW: number,
    relativeH: number
  ): Promise<fabric.FabricObject> {
    // const url = `${getMediaUrl()}/${obj.attr.src}`;
    // const url = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg';
    // const url = 'https://icon-icons.com/icons2/265/PNG/512/JPG_29711.png';

    // const url = 'http://localhost:5173/assets/SVG/MesaDeTrabajo.svg';
    console.info('obj', obj);
    const url = 'http://localhost:5173/book_covers/5.jpg';

    const img = await fabric.FabricImage.fromURL(url, {
      crossOrigin: 'anonymous',
    });
    return img.set({
      scaleX: 2,
      cropX: 2,
      left: relativeX,
      top: relativeY,
      width: relativeW,
      height: relativeH,
      selectable: true,
      hasControls: true,
    } as fabric.ImageProps);
  }

  async getObject(): Promise<fabric.Object> {
    if (!this.img) {
      throw new Error('Image has not been created yet');
    }
    return await this.img;
  }

  draw(canvas: fabric.Canvas): void {
    console.log('draw', canvas);
    // if (this.img) {
    //   canvas.add(this.img);
    //   return this.img;
    // } else {
    //   throw new Error('Image not loaded yet');
    // }
  }

  update(obj: ImageElement): void {
    console.log('obj', obj);
    // if (this.img) {
    //   this.img.set(attrs);
    // } else {
    //   throw new Error('Cannot update; image not loaded yet');
    // }
  }

  delete(): void {
    // if (this.img) {
    //   this.img.remove();
    // }
  }
}
