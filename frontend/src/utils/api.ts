const API_URL = import.meta.env.VITE_API_URL;
const API_URL_TEST = import.meta.env.VITE_API_URL_TEST;
const PUBLIC_URI = import.meta.env.VITE_PUBLIC_URI;

console.log('API_URL', API_URL);
console.log('PUBLIC_URI', PUBLIC_URI);
console.log('API_URL_TEST', API_URL_TEST);
export const getPublicURI = (): string => {
  return PUBLIC_URI;
};
export const getBooksUrl = (): string => {
  return `${API_URL}/books?delay=500`;
};
