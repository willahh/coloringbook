import { BookDataService } from './book-data.service';
import { BookExportService } from './book-export.service';
import canvasService from './canvas.service';

export const bookDataService = new BookDataService();
// export const bookExportService = new BookExportService(canvasService);
export const bookExportService = new BookExportService();

export const services = {
  bookDataService,
  bookExportService,
  canvasService,
};
