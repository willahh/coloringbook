import { BookFormat } from './book.enum';

interface ElementAttributes {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

type RectAttributes = ElementAttributes;
type CircleAttributes = ElementAttributes;
type TriangleAttributes = ElementAttributes;
interface TextElement extends ElementAttributes {
  text: {
    text: string;
    fontSize: 12;
    textAlign: string;
    color: string;
  };
}
interface ImageElement {
  imageData: string;
}

interface Element {
  type: 'image' | 'rectangle' | 'circle' | 'triangle' | 'text';
  x: number;
  y: number;
  w: number;
  h: number;
  attr:
    | RectAttributes
    | CircleAttributes
    | TriangleAttributes
    | TextElement
    | ImageElement;
}

export interface IBook {
  id: number;
  name: string;
  format: BookFormat;
  coverImage: string;
  pageCount: number;
  pages: Array<{
    pageNumber: number;
    AspectRatio: { w: number; h: number };
    elements: Element[];
  }>;
}
