import * as fabric from 'fabric';
import { Page } from '@apptypes/book';

export interface BookExport {
  exportToPDF(params: { canvas: fabric.Canvas; pages: Page[] }): Promise<void>;
  printPDF(params: { canvas: fabric.Canvas; pages: Page[] }): Promise<void>;
}
