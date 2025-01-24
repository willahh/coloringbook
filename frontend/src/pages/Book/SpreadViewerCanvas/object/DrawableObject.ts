import * as fabric from 'fabric';

export interface DrawableObject {
  draw(canvas: fabric.Canvas): fabric.Object;
  update(attrs: unknown): void; // Adjust the parameter type according to your needs
  delete(): void;
  getObject(): fabric.Object; // New method to get the fabric object
}
