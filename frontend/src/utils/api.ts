const API_URL = import.meta.env.VITE_API_URL;

export const getBooksUrl = (): string => {
  return `${API_URL}/books?delay=500`;
};
