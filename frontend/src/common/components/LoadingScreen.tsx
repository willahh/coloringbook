// LoadingScreen.tsx
import { useEffect, useState } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';

const Spinner: React.FC = () => (
  <div className="relative">
    <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
  </div>
);

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [isFirstLoad] = useSessionStorage('first-load', true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShow(true), 300);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isFirstLoad) {
      window.sessionStorage.setItem('first-load', 'false');
    }
  }, [isFirstLoad]);

  if (!show || !isLoading) return null;

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center transition-colors duration-300">
      {isFirstLoad ? (
        <div className="text-center space-y-6 p-6 max-w-md">
          <Spinner />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Chargement de l'application
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Le premier chargement peut prendre environ{' '}
            <span className="text-nowrap">une minute ou deux</span> en raison du
            démarrage à froid du serveur. Merci de votre patience !
          </p>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default LoadingScreen;
