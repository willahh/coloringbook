import React, { useEffect, useRef, useState } from 'react';
import Layout from './layout';
import Button from '@components/Button';
import AnimatedText from '@/components/AnimatedText';
import Logo from '@assets/coloring-book-logo-wide.svg?react';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { motion } from 'motion/react';

// -----------------------------------------------------------------------------
const formatOptions = [
  { value: 'square', label: 'Carré' },
  { value: 'portraitA4', label: 'Portrait A4' },
  { value: 'landscapeA4', label: 'Paysage A4' },
];

interface BookCreationFormProps {
  className?: string;
  isVisible: boolean;
  onCancelClick: () => void;
}
const BookCreationForm: React.FC<BookCreationFormProps> = ({
  className,
  isVisible,
  onCancelClick,
}) => {
  const bookNameInput = useRef<HTMLInputElement | null>(null);
  const hiddenStyle = { y: -100, opacity: 0, height: 0 };
  const visibleStyle = { y: 0, opacity: 1, height: 'auto' };
  const animateStyle = isVisible
    ? { ...visibleStyle, ...{ overflow: 'hidden' } }
    : { ...hiddenStyle, ...{ overflow: 'hidden' } };

  useEffect(() => {
    if (isVisible) {
      if (bookNameInput.current) {
        bookNameInput.current.focus();
      }
    }
  }, [isVisible]);

  return (
    <motion.div
      initial={isVisible ? hiddenStyle : visibleStyle}
      animate={animateStyle}
      transition={{
        delay: 0,
        duration: 0.3,
        type: 'tween',
      }}
    >
      <form className={`space-y-4 ${className || ''}`}>
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
            disabled={!isVisible}
            ref={bookNameInput}
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
            disabled={!isVisible}
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
            disabled={!isVisible}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
          />
        </div>
        <Button
          type="submit"
          disabled={!isVisible}
          className="flex justify-center w-full rounded-md py-1 px-2 text-sm md:text-base"
        >
          <span>Valider</span>
        </Button>
        <Button
          type="reset"
          disabled={!isVisible}
          onClick={onCancelClick}
          className="flex justify-center w-full rounded-md py-1 px-2 text-sm md:text-base"
        >
          <span>Annuler</span>
        </Button>
      </form>
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
interface DescriptionSectionProps {
  onClick: () => void;
  className?: string;
  isVisible: boolean;
}
const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  onClick,
  className,
  isVisible,
}) => {
  const hiddenStyle = { y: -100, opacity: 0, height: 0 };
  const visibleStyle = { y: 0, opacity: 1, height: 'auto' };
  const animateStyle = isVisible
    ? { ...visibleStyle, ...{ overflow: 'hidden' } }
    : { ...hiddenStyle, ...{ overflow: 'hidden' } };

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  // useEffect(() => {
  //   if (isVisible) {
  //     if (buttonRef.current) {
  //       buttonRef.current.focus();
  //     }
  //   }
  // }, [isVisible]);

  return (
    <motion.div
      initial={isVisible ? hiddenStyle : visibleStyle}
      animate={animateStyle}
      transition={{
        delay: 0,
        duration: 0.3,
        type: 'tween',
      }}
    >
      <AnimatedText enterClassName="delay-300">
        <p className="text-base mb-4 text-justify">
          <strong>Plongez dans un univers créatif et coloré</strong> où vous
          pouvez concevoir des motifs originaux, laisser libre cours à votre
          personnalité à travers le coloriage et partager vos créations avec
          notre communauté.
        </p>
      </AnimatedText>
      <AnimatedText enterClassName="delay-500">
        <p className="text-base mb-4 text-indigo-300">
          Lancez-vous dès aujourd'hui :
        </p>
      </AnimatedText>
      <AnimatedText enterClassName="delay-1000">
        <div>
          <Button
            className="flex justify-center w-full rounded-xl py-1 px-2"
            autoFocus={true}
            // ref={buttonRef}
            onClick={onClick}
          >
            <BookOpenIcon aria-hidden="true" className="size-8" />
            <span className="whitespace-nowrap">Créer un nouveau livre</span>
          </Button>
        </div>
      </AnimatedText>
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
const HomePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const handleCreateBookClick = () => {
    setShowForm(true);
  };
  const handleCancelClick = () => {
    setShowForm(false);
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
            <BookCreationForm
              isVisible={showForm}
              onCancelClick={handleCancelClick}
            />
            <DescriptionSection
              isVisible={!showForm}
              onClick={handleCreateBookClick}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
