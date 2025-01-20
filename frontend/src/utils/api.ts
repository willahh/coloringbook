const API_URL = import.meta.env.VITE_API_URL;
const PUBLIC_URI = import.meta.env.VITE_PUBLIC_URI;

/**
 * Retrieves the public URI from the environment variables.
 *
 * @returns {string} The public URI.
 */
export const getPublicURI = (): string => {
  return PUBLIC_URI;
};

/**
 * Constructs the URL for fetching books with a delay parameter.
 * 
 * => {API_URL}/books
 *
 * @returns {string} The URL for fetching books.
 */
export const getBooksUrl = (): string => {
  return `${API_URL}/books?delay=500`;
};
