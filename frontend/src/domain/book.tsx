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

// Union type for all possible attribute types
export type ElementAttributes =
  | RectAttributes
  | CircleAttributes
  | TriangleAttributes
  | TextElement
  | ImageElement;

export interface Element {
  type: 'image' | 'rectangle' | 'circle' | 'triangle' | 'text';
  x: number;
  y: number;
  w: number;
  h: number;
  attr: ElementAttributes;
}

export interface Page {
  pageNumber: number;
  AspectRatio: { w: number; h: number };
  elements: Element[];
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
export function isShapeElement(
  attr: ElementAttributes
): attr is RectAttributes | CircleAttributes | TriangleAttributes {
  return 'fill' in attr;
}

export function isTextElement(attr: ElementAttributes): attr is TextElement {
  return 'text' in attr;
}

export function isImageElement(attr: ElementAttributes): attr is ImageElement {
  return 'imageData' in attr;
}
