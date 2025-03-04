import { AxiosError } from 'axios';

export interface AxiosErrorResponse {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

export const handleAxiosError = (error: unknown): AxiosErrorResponse => {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status || 0,
      message:
        error.response?.data?.message ||
        error.message ||
        'Erreur réseau ou inconnue',
      details: error.response?.data || undefined,
    };
  }

  return {
    status: 0,
    message: 'Erreur inattendue',
    details: undefined,
  };
};
