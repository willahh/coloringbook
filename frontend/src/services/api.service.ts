import axios from 'axios';
import { Book } from '@/types/book';
import { GraphicAsset } from '@/types/graphic-asset.entity';
import { getAPIURL } from '@/utils/api';

class APIService {
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // book
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  static async fetchBook(bookId: number): Promise<Book> {
    const response = await axios.get<Book>(`${getAPIURL()}/books/${bookId}`);
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
