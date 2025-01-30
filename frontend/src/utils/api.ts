const API_URL = import.meta.env.VITE_API_URL;
const PUBLIC_URI = import.meta.env.VITE_PUBLIC_URI;
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;

export const getPublicURI = (): string => {
  return PUBLIC_URI;
};

export const getAPIURL = (): string => {
  return API_URL;
};

export const getMediaUrl = (): string => {
  return MEDIA_URL;
};

export const getBooksUrl = (): string => {
  return `${API_URL}/books`;
};
