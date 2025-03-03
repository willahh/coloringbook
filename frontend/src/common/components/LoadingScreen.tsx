import { useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';

const Spinner: React.FC = () => (
  <div className="relative">
    <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
  </div>
);
const LoadingScreen: React.FC = () => {
  const [isFirstLoad] = useSessionStorage('first-load', true);
  useEffect(() => {
    if (isFirstLoad) {
      window.sessionStorage['first-load'] = false;
    }
  }, [isFirstLoad]);

  return (
    <>
      {isFirstLoad ? (
        <div className="min-w-screen min-h-screen flex items-center justify-center transition-colors duration-300">
          <div className="text-center space-y-6 p-6 max-w-md">
            <Spinner />

            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Chargement de l'application
            </h1>

            <p className="text-gray-600 dark:text-gray-300">
              Le premier chargement peut prendre environ{' '}
              <span className="text-nowrap">une minute ou deux</span> en raison
              du démarrage à froid du serveur. Merci de votre patience !
            </p>
          </div>
        </div>
      ) : (
        <div className="min-w-screen min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
