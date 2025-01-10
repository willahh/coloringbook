import React, { useState } from 'react';
import Layout from './layout';
import Button from '@components/Button';
import AnimatedText from '@/components/AnimatedText';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import { BookOpenIcon } from '@heroicons/react/24/solid';




// -----------------------------------------------------------------------------
const formatOptions = [
  { value: 'square', label: 'Carré' },
  { value: 'portraitA4', label: 'Portrait A4' },
  { value: 'landscapeA4', label: 'Paysage A4' },
];

const BookCreationForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div>
        <label
          htmlFor="bookName"
          className="block text-sm md:text-base font-medium text-white mb-1"
        >
          Nom
        </label>
        <input
          type="text"
          id="bookName"
          name="bookName"
          className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
        />
      </div>
      <div>
        <label
          htmlFor="format"
          className="block text-sm md:text-base font-medium text-white mb-1"
        >
          Format
        </label>
        <select
          id="format"
          name="format"
          className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
        >
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="numberOfPages"
          className="block text-sm md:text-base font-medium text-white mb-1"
        >
          Nombre de pages
        </label>
        <input
          type="number"
          id="numberOfPages"
          name="numberOfPages"
          className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
        />
      </div>
      <Button
        type="submit"
        className="flex justify-center w-full rounded-md py-1 px-2 text-sm md:text-base"
      >
        <span>Valider</span>
      </Button>
    </form>
  );
};




// -----------------------------------------------------------------------------
interface DescriptionSectionProps {
  onClick: () => void;
}
const DescriptionSection: React.FC<DescriptionSectionProps> = ({ onClick }) => {
  return (
    <>
      <AnimatedText enterClassName="delay-300">
        <p className="text-base mb-4 text-justify">
          <strong>Plongez dans un univers créatif et coloré</strong> où vous
          pouvez concevoir des motifs originaux, laisser libre cours à votre
          personnalité à travers le coloriage et partager vos créations avec
          notre communauté.
        </p>
      </AnimatedText>
      <AnimatedText enterClassName="delay-800">
        <p className="text-base mb-4 text-indigo-300">
          Lancez-vous dès aujourd'hui :
        </p>
      </AnimatedText>
      <AnimatedText enterClassName="delay-500">
        <div>
          <Button
            className="flex justify-center w-full rounded-xl py-1 px-2"
            onClick={onClick}
          >
            <BookOpenIcon aria-hidden="true" className="size-8" />
            <span>Create new book</span>
          </Button>
        </div>
      </AnimatedText>
    </>
  );
};




// -----------------------------------------------------------------------------
const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const handleCreateBookClick = () => {
    setShowForm(true);
  };

  return (
    <Layout showHeader={false}>
      <div
        className="flex w-full w-screen h-screen items-center"
        style={{
          background: 'url(assets/home_background.svg) bottom right no-repeat',
        }}
      >
        {/* <img
          className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none"
          src="mockup/home-2025-01-09.png"
          style={{
            filter: 'invert(100%)',
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            top: '-60px',
          }}
          alt=""
        /> */}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-16 md:px-0">
          <div className="xl:col-span-4"></div>
          <div className="md:col-start-3 md:col-span-4 xl:col-start-5 xl:col-span-2 text-white">
            <Logo className="mb-4 md:-ml-16 max-w-xs" />

            <AnimatedText enterClassName="delay-200">
              <div className="flex mb-4 gap-2 items-center text-md font-extralight">
                <span className="">Create</span>
                <span className="text-primary-200 bg-primary-900 p-1 px-2 rounded-md shadow-xl border border-primary-800">
                  color
                </span>
                <span className="">share</span>
              </div>
            </AnimatedText>

            {showForm ? (
              <BookCreationForm />
            ) : (
              <DescriptionSection onClick={handleCreateBookClick} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
