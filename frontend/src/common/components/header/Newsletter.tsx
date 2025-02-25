import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '@/common/hooks/useLocalStorage';

interface NewsletterProps {
  onSubscribe: (email: string) => void; // Fonction callback pour gérer l'inscription
}

const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [hasSubscribed, setHasSubscribed] = useLocalStorage('newsletter', null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    if (email) {
      onSubscribe(email);
      setEmail('');
    } else {
      alert('Veuillez entrer une adresse email valide.');
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
            <div className="flex gap-4 mt-2 ">
              <div className="flex-1 grid grid-cols-1">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  aria-label="Adresse email pour vous abonner à la newsletter"
                  placeholder="you@example.com"
                  className={`col-start-1 row-start-1 block w-full rounded-md pl-10 pr-3 text-base
          bg-white py-1.5 text-gray-900
            outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
            focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6`}
                />
                <EnvelopeIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                />
              </div>
              <button onClick={handleSubscribe} className="btn">
                S’inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Newsletter;
