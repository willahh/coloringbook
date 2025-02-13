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
  svgContent?: string;
  svgURL?: string;
}

export interface ImageElement {
  elementId: number;
  type: 'image';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: {
    // imageData: string;
    src: string;
  };
}
export interface RectangleElement {
  elementId: number;
  type: 'rectangle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: BaseShapeAttributes;
}
export interface TriangleElement {
  elementId: number;
  type: 'triangle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: BaseShapeAttributes;
}
export interface CircleElement {
  elementId: number;
  type: 'circle';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: CircleAttributes;
}
export interface TextElement {
  elementId: number;
  type: 'text';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: TextAttributes;
}
export interface SVGElement {
  elementId: number;
  type: 'svg';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: SVGAttributes;
}

export type Element =
  | RectangleElement
  | CircleElement
  | TriangleElement
  | TextElement
  | ImageElement
  | SVGElement;

export interface Page {
  pageId: number;
  pageNumber: number;
  aspectRatio: { width: number; height: number };
  elements: Element[];
  thumbImageData?: string;
}

export interface Book {
  id: number;
  name: string;
  format: BookFormat;
  coverImage: string;
  pageCount: number;
  pages: Page[];
}

export function isShape(
  obj: Element
): obj is RectangleElement | CircleElement | TriangleElement {
  return (
    'fill' in obj.attr && 'stroke' in obj.attr && 'strokeWidth' in obj.attr
  );
}

export function isText(obj: Element): obj is TextElement {
  return 'text' in obj.attr;
}

export function isSVG(obj: Element): obj is SVGElement {
  return 'svgContent' in obj.attr;
}

export function isImage(obj: Element): obj is ImageElement {
  return 'src' in obj.attr;
}
