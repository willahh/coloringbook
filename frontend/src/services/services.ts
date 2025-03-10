import { Capacitor } from '@capacitor/core';
import { BookDataService } from './book/BookDataService';
import { BookExportDesktopService } from './book/BookExportDesktopService';
import { BookExportIOSService } from './book/BookExportIOSService';
import { BookExportAndroidService } from './book/BookExportAndroidService';
import canvasService from './CanvasService';
import { BookExport } from './book/BookExportInterface';

// Instancier le service d’exportation en fonction de la plateforme
const platform = Capacitor.getPlatform();
let bookExportService: BookExport;

switch (platform) {
  case 'ios':
    bookExportService = new BookExportIOSService(canvasService);
    break;
  case 'android':
    bookExportService = new BookExportAndroidService(canvasService);
    break;
  default:
    bookExportService = new BookExportDesktopService(canvasService);
    break;
}

// Instancier les autres services
export const bookDataService = new BookDataService();

// Exporter les services
export const services = {
  bookDataService,
  bookExportService,
  canvasService,
};
