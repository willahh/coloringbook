const API_URL = import.meta.env.VITE_API_URL;
const PUBLIC_URI = import.meta.env.VITE_PUBLIC_URI;

export const getPublicURI = (): string => {
  return PUBLIC_URI;
};
export const getBooksUrl = (): string => {
  return `${API_URL}/books?delay=500`;
};
