import { AxiosError } from 'axios';
import { useState } from 'react';

interface ServerError {
  message: string;
}

interface ErrorScreenProps {
  error: AxiosError<ServerError>;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  console.log('ErrorScreen error: ', error);

  // État pour gérer la tentative de rechargement
  const [isRetrying, setIsRetrying] = useState(false);

  // Vérifier si c'est une erreur 503
  const isServiceUnavailable = error.response?.status === 503;
  const errorMessage =
    error.response?.data?.message || 'Une erreur inattendue s’est produite.';
  const isTestingMessage = errorMessage.includes('for testing');

  // Fonction pour recharger la page après un délai
  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
      setIsRetrying(false);
    }, 1000); // Délai de 1 seconde pour un effet fluide
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="text-center space-y-6 p-6 max-w-md bg-white dark:bg-primary-900 rounded-lg shadow-lg">
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl mb-1 font-semibold text-gray-800 dark:text-gray-100">
          Oops ! Problème de connexion
        </h1>
        <p className='text-gray-400 dark:text-gray-600 mb-1'>{errorMessage}</p>
        <p className="text-gray-600 dark:text-gray-300 space-y-2">
          {isServiceUnavailable && (
            <span>
              <br />
              {isTestingMessage
                ? 'Le serveur est indisponible pour des raisons de test.'
                : "Notre serveur est temporairement indisponible, probablement en raison d'une interruption sur notre hébergeur (Render.com)."}
              <br />
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={handleRetry}
              >
                {isRetrying
                  ? 'Rechargement en cours...'
                  : 'Réessayez maintenant'}
              </span>{' '}
              ou revenez plus tard.
            </span>
          )}
        </p>
        {!isServiceUnavailable && (
          <p className="text-gray-500 dark:text-gray-400">
            Une erreur inattendue s’est produite. Contactez le support si cela
            persiste.
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorScreen;
