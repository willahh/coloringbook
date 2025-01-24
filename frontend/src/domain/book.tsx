import { BookFormat } from './book.enum';

// Common attributes for shapes
interface ShapeAttributes {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Specific attributes for different element types
interface RectAttributes extends ShapeAttributes {}
interface CircleAttributes extends ShapeAttributes {}
interface TriangleAttributes extends ShapeAttributes {}

interface TextAttributes {
  text: string;
  fontSize: number; // Changed to number for flexibility
  textAlign: 'left' | 'center' | 'right'; // More specific than just 'string'
  color: string;
}

interface TextElement extends ShapeAttributes {
  text: TextAttributes;
}

interface ImageElement {
  imageData: string;
}
interface SVGAttributes {
  svgContent: string;
}

export type ObjectAttributes =
  | RectAttributes
  | CircleAttributes
  | TriangleAttributes
  | TextElement
  | ImageElement
  | SVGAttributes;

export interface Object {
  type: 'image' | 'rectangle' | 'circle' | 'triangle' | 'text' | 'svg';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: ObjectAttributes;
}

export interface Page {
  pageNumber: number;
  AspectRatio: { w: number; h: number };
  elements: Object[];
}

export interface IBook {
  id: number;
  name: string;
  format: BookFormat;
  coverImage: string;
  pageCount: number;
  pages: Page[];
}

// Type guards to check the type of element.attr
export function isShapeObject(
  attr: ObjectAttributes
): attr is RectAttributes | CircleAttributes | TriangleAttributes {
  return 'fill' in attr;
}

export function isTextObject(attr: ObjectAttributes): attr is TextElement {
  return 'text' in attr;
}

export function isImageObject(attr: ObjectAttributes): attr is ImageElement {
  return 'imageData' in attr;
}
