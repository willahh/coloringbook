import pako from 'pako';
import axios from 'axios';
import { Book } from '@apptypes/book';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';
import { getAPIURL } from '@/common/utils/api';

class APIService {
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // book
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  static async fetchBooks(): Promise<Book[]> {
    const response = await axios.get<Book[]>(
      `${getAPIURL()}/books`
    );
    return response.data;
  }
  static async fetchBook(bookId: number): Promise<Book> {
    const response = await axios.get<Book>(
      `${getAPIURL()}/books/${bookId}`
    );
    return response.data;
  }

  static async saveBook(
    bookId: number,
    updateBookDTO: Partial<Book>
  ): Promise<Book> {
    const compressed = pako.gzip(JSON.stringify(updateBookDTO));
    const response = await axios.patch<Book>(
      `${getAPIURL()}/books/${bookId}`,
      compressed,
      {
        headers: {
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  static async updateBook(
    bookId: number,
    updateBookDTO: Partial<Book>
  ): Promise<Book> {
    const response = await axios.patch<Book>(
      `${getAPIURL()}/books/${bookId}`,
      updateBookDTO
    );
    return response.data;
  }

  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // GraphicAssets
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  static async fetchGraphicAssets(): Promise<GraphicAsset[]> {
    const response = await axios.get<GraphicAsset[]>(
      `${getAPIURL()}/graphic-assets`
    );
    return response.data;
  }
}

export default APIService;
