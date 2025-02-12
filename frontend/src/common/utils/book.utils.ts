import { BookFormat } from '@/types/book.enum';

export class BookFormatHelper {
  private static formatToAspectRatio: {
    [key in BookFormat]: { width: number; height: number };
  } = {
    [BookFormat.CARRE]: { width: 1, height: 1 },
    [BookFormat.A4_PORTRAIT]: { width: 1, height: 1.414 },
    [BookFormat.A4_PAYSAGE]: { width: 1.414, height: 1 },
  };

  public static getAspectRatio(format: BookFormat): {
    width: number;
    height: number;
  } {
    return this.formatToAspectRatio[format];
  }
}
