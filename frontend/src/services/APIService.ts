import pako from 'pako';
import axios from 'axios';
import { Book } from '@apptypes/book';
import { GraphicAsset } from '@apptypes/graphic-asset.entity';
import { getAPIURL } from '@/common/utils/api';
import { handleAxiosError } from '@/common/utils/errorUtils';

// TODO: mettre api dans un autre fichier
const api = axios.create({
  baseURL: getAPIURL(),
});

// Intercepteur pour capturer les erreurs et les transformer
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleAxiosError(error))
);

class APIService {
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // book
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  static async fetchBooks(): Promise<Book[]> {
    const response = await axios.get<Book[]>(`${getAPIURL()}/books`);
    return response.data;
  }
  static async fetchBook(bookId: number): Promise<Book> {
    const response = await axios.get<Book>(`${getAPIURL()}/books/${bookId}`);
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

  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // /image
  // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  /**
   * POST /image/save
   */
  static async saveSvg(svgContent: string) {
    try {
      const formData = new FormData();
      formData.append('svgContent', svgContent);

      const response = await axios.post(`${getAPIURL()}/image/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // { svgPath, pngPath }
    } catch (error) {
      console.error('Error saving SVG:', error);
      throw error;
    }
  }

  static async fetchSvgConvertedList(): Promise<
    {
      name: string;
      file: string;
      thumb: string;
    }[]
  > {
    try {
      const response = await axios.get(
        `${getAPIURL()}/image/svg-converted-list`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching SVG list:', error);
      throw error;
    }
  }

  static async fetchSvgContent(filePath: string) {
    try {
      const response = await axios.get(
        `${getAPIURL()}/image/svg-content-from-path/${filePath}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching SVG content:', error);
      throw error;
    }
  }
}

export default APIService;
