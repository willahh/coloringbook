import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Button from '@components/Button';

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
  const animateStyle = isVisible ? { ...visibleStyle } : { ...hiddenStyle };

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
      <form
        className={`space-y-4 ${className || ''} 
        ${isVisible ? '' : 'pointer-events-none'}`}
      >
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

export default BookCreationForm;
