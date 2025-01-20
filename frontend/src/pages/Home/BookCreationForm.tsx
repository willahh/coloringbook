import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import Button from '@components/Button';
import { getBooksUrl } from '@/utils/api';

const formatOptions = [
  { value: 'square', label: 'Carré' },
  { value: 'portraitA4', label: 'Portrait A4' },
  { value: 'landscapeA4', label: 'Paysage A4' },
];

// FIXME: Share with backend
const bookSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire.'),
  format: z.enum(['carré', 'rectangulaire']).default('carré'),
  pageCount: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)),
      'Le nombre de pages doit être un nombre valide.'
    )
    .transform((val) => Number(val))
    .pipe(z.number().min(1, 'Le nombre de pages doit être au moins 1.')), // Validation après transformation

  pages: z.array(z.object({})).default([]),
  coverImage: z
    .string()
    .url("L'URL de l'image de couverture est invalide.")
    .optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

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


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  console.log('errors', errors);

  const onSubmit = async (data: BookFormData) => {
    console.log('onSubmit', data);
    try {
      const response = await fetch(getBooksUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert('Livre créé avec succès !');
    } catch (error) {
      alert('Une erreur est survenue.');
    }
  };

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
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm md:text-base font-medium text-white mb-1"
          >
            Nom
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="name"
                type="text"
                value={field.value ?? ''}
                placeholder="Nom du livre"
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              />
            )}
          ></Controller>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="format"
            className="block text-sm md:text-base font-medium text-white mb-1"
          >
            Format
          </label>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="format"
                name="format"
                value={field.value ?? ''}
                disabled={!isVisible}
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              >
                {formatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.format && (
            <p className="text-sm text-red-500">{errors.format?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm md:text-base font-medium text-white mb-1"
          >
            Image
          </label>
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="file"
                id="bookImage"
                name="bookImage"
                value={field.value ?? ''}
                disabled={!isVisible}
                // onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          />
          {errors.coverImage && (
            <p className="text-sm text-red-500">{errors.coverImage?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="pageCount"
            className="block text-sm md:text-base font-medium text-white mb-1"
          >
            Nombre de pages
          </label>
          <Controller
            name="pageCount"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="pageCount"
                name="pageCount"
                value={field.value ?? ''}
                disabled={!isVisible}
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              />
            )}
          />
          {errors.pageCount && (
            <p className="text-sm text-red-500">{errors.pageCount?.message}</p>
          )}
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
