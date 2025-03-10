import { Capacitor } from '@capacitor/core';
import * as fabric from 'fabric';

import { Page } from '@apptypes/book';
import { BookExportAbstractService } from './BookExportAbstractService';
import { BookExport } from './BookExportInterface';

export class BookExportAndroidService
  extends BookExportAbstractService
  implements BookExport
{
  async exportToPDF({
    canvas,
    pages,
  }: {
    canvas: fabric.Canvas;
    pages: Page[];
  }) {
    console.log('exportToPDF', canvas, pages);
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Cette méthode est réservée à Android');
    }
    // TODO: Implémenter l’exportation PDF pour Android
    throw new Error('Export PDF pour Android non implémenté');
  }

  async printPDF({ canvas, pages }: { canvas: fabric.Canvas; pages: Page[] }) {
    console.log('exportToPDF', canvas, pages);

    if (!Capacitor.isNativePlatform()) {
      throw new Error('Cette méthode est réservée à Android');
    }
    // TODO: Implémenter l’impression PDF pour Android
    throw new Error('Print PDF pour Android non implémenté');
  }
}
