import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError, AxiosResponse } from 'axios'; // Importer axios
import useLocalStorage from '@/common/hooks/useLocalStorage';
import { getAPIURL } from '@/common/utils/api';
import { trackEvent } from '@/common/utils/analyticsEvents';

interface NewsletterProps {
  onSubscribe: (email: string) => void; // Fonction callback (optionnelle, à ajuster selon vos besoins)
}

const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [hasSubscribed, setHasSubscribed] = useLocalStorage('newsletter', null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      trackEvent('NEWSLETTER_SUBSCRIBE', 'email: ' + email);
      const response: AxiosResponse = await axios.post(
        getAPIURL() + '/newsletter/subscribe',
        {
          email,
        }
      );

      const emailResponse = response.data.email;

      setHasSubscribed(emailResponse);
      setEmail('');
      if (onSubscribe) {
        onSubscribe(emailResponse);
      }
      console.log('Inscription réussie:', response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response) {
          const errorMessage =
            err.response.data.message ||
            'Une erreur est survenue lors de l’inscription.';
          setError(
            Array.isArray(errorMessage) ? errorMessage.join(' ') : errorMessage
          );
          trackEvent(
            'NEWSLETTER_SUBSCRIBE_ERROR',
            'email: ' + email + ' - error: ' + errorMessage
          );
        } else {
          setError('Une erreur réseau est survenue. Veuillez réessayer.');
        }
        console.error('Erreur lors de l’inscription:', err);
      } else {
        setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        console.error('Erreur inattendue:', err);
      }
    } finally {
      setIsLoading(false); // Terminer le chargement
    }
  };

  return (
    <>
      {!hasSubscribed && (
        <div className="newsletter-section">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Abonnez-vous pour recevoir les mises à jour
          </h4>
          <p>
            Restez informé des nouvelles versions, mises à jour et annonces
            liées à Coloring Book.
          </p>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              {/* Email */}
            </label>
            <div className="flex gap-4 mt-2">
              <div className="flex-1 grid grid-cols-1">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label="Adresse email pour vous abonner à la newsletter"
                  placeholder="you@example.com"
                  className={`col-start-1 row-start-1 block w-full rounded-md pl-10 pr-3 text-base
                    bg-white py-1.5 text-gray-900
                    outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                    focus:outline focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6
                    ${error ? 'border-red-500' : ''}`} // Ajouter une bordure rouge en cas d’erreur
                />
                <EnvelopeIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                />
              </div>
              <button
                onClick={handleSubscribe}
                className="btn btn-secondary"
                disabled={isLoading} // Désactiver le bouton pendant le chargement
              >
                {isLoading ? 'Chargement...' : 'S’inscrire'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p> // Afficher un message d’erreur
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Newsletter;
