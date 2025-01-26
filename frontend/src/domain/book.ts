import { BookFormat } from './book.enum';

interface BaseShapeAttributes {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

interface CircleAttributes extends BaseShapeAttributes {
  radius?: number;
}

interface TextAttributes extends BaseShapeAttributes {
  text: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

export interface SVGAttributes {
  svgContent: string;
}

export interface ImageObject {
  type: 'image';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: {
    imageData: string;
  };
}
export interface RectangleObject {
  type: 'rectangle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: BaseShapeAttributes;
}
export interface TriangleObject {
  type: 'triangle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: BaseShapeAttributes;
}
export interface CircleObject {
  type: 'circle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: CircleAttributes;
}
export interface TextObject {
  type: 'text';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: TextAttributes;
}
export interface SVGObject {
  type: 'svg';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: SVGAttributes;
}

export type Obj =
  | RectangleObject
  | CircleObject
  | TriangleObject
  | TextObject
  | ImageObject
  | SVGObject;

export interface Page {
  pageId: number;
  pageNumber: number;
  aspectRatio: { width: number; height: number };
  elements: Obj[];
}

export interface IBook {
  id: number;
  name: string;
  format: BookFormat;
  coverImage: string;
  pageCount: number;
  pages: Page[];
}

export function isShapeObject(
  obj: Obj
): obj is RectangleObject | CircleObject | TriangleObject {
  return (
    'fill' in obj.attr && 'stroke' in obj.attr && 'strokeWidth' in obj.attr
  );
}

export function isTextObject(obj: Obj): obj is TextObject {
  return 'text' in obj.attr;
}

export function isSVGObject(obj: Obj): obj is SVGObject {
  return 'svgContent' in obj.attr;
}

export function isImageObject(obj: Obj): obj is ImageObject {
  return 'imageData' in obj.attr;
}
