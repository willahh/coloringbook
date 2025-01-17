const API_URL = window.process.env.API_URL;

export const getBooksUrl = (): string => {
  return `${API_URL}/books?delay=500`;
};
