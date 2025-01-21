import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import Button from '@components/Button';
import { getBooksUrl } from '@/utils/api';
import { IBook } from '@/domain/book';
import { TrashIcon } from '@heroicons/react/20/solid';

const formatOptions = [
  { value: 'carré', label: 'Carré' },
  { value: 'A4_portrait', label: 'Portrait A4' },
  { value: 'A4_paysage', label: 'Paysage A4' },
];

// FIXME: Share with backend
const bookSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire.'),
  format: z.enum(['carré', 'A4_portrait', 'A4_paysage']).default('carré'),
  // pageCount: z
  //   .string()
  //   .refine(
  //     (val) => !isNaN(Number(val)),
  //     'Le nombre de pages doit être un nombre valide.'
  //   )
  //   .transform((val) => Number(val))
  //   .pipe(z.number().min(1, 'Le nombre de pages doit être au moins 1.')), // Validation après transformation

  pageCount: z.string(),
  pages: z.array(z.object({})).default([]),
  coverImage: z.any().optional(), // Change this to handle file uploads
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookCreationFormProps {
  className?: string;
  isVisible: boolean;
  onCancelClick: () => void;
  showToast: (message: string, type: 'success' | 'error') => void; // Add showToast prop
  onBookCreationSuccess?: (book: IBook) => void;
}

const BookCreationForm: React.FC<BookCreationFormProps> = ({
  className,
  isVisible,
  onCancelClick,
  showToast,
  onBookCreationSuccess,
}) => {
  const bookNameInput = useRef<HTMLInputElement | null>(null);
  const hiddenStyle = { y: -100, opacity: 0, height: 0 };
  const visibleStyle = { y: 0, opacity: 1, height: 'auto' };
  const animateStyle = isVisible ? { ...visibleStyle } : { ...hiddenStyle };
  const [isLoading, setIsLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit = async (data: BookFormData) => {
    console.log('onSubmit', data);
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'coverImage') {
        formData.append(key, value.toString());
      }
    });

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await fetch(getBooksUrl(), {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Une erreur est survenue.');
      }

      const responseData = await response.json();
      showToast(`Livre ${responseData.name} créé avec succès !`, 'success'); // Use showToast function
      reset(); // Reset the form to its initial state
      onCancelClick();
      onBookCreationSuccess?.(responseData);
    } catch (e) {
      console.error(e);
      showToast('Une erreur est survenue.', 'error'); // Use showToast function
    } finally {
      setIsLoading(false);
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
        // encType="multipart/form-data"
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
                disabled={isLoading}
                placeholder="Nom du livre"
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                ref={bookNameInput}
              />
            )}
          ></Controller>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="border border-red-500">
            a<br />a
          </div>
          <div className="border border-red-500">b</div>
          <div className="border border-red-500">c</div>
          <div className="border border-red-500">d</div>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <label
            // className="col-span-2"
            htmlFor="format"
            className=" self-center text-sm md:text-base font-medium text-white"
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
                disabled={!isVisible || isLoading}
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
            <p className="col-span-2 text-sm text-red-500">
              {errors.format?.message}
            </p>
          )}

          <label
            htmlFor="pageCount"
            className="  self-center text-sm md:text-base font-medium text-white"
          >
            Nombre de pages
          </label>
          <Controller
            name="pageCount"
            control={control}
            defaultValue={'12'}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="pageCount"
                name="pageCount"
                value={field.value ?? '12'}
                disabled={!isVisible || isLoading}
                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              />
            )}
          />
          {errors.pageCount && (
            <p className="col-span-2 text-sm text-red-500">
              {errors.pageCount?.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label
            htmlFor="image"
            className="block text-sm md:text-base font-medium text-white mb-1"
          >
            Couverture
          </label>
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <>
                {/* Input de type file caché */}
                <input
                  {...field}
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onFocus={() => console.log('focus')}
                  tabIndex={0}
                  onChange={(e) => {
                    console.log('onChange', e.target.files);
                    setCoverImage(e.target.files?.[0] || null);
                  }}
                  // className="hidden"
                  style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                />

                {/* Afficher l'image sélectionnée */}
                {coverImage && (
                  <div className="relative w-24 h-24 overflow-hidden rounded-md">
                    <div
                      className="absolute w-5 h-5 flex items-center justify-center
                      cursor-pointer top-1 right-1 shadow-sm rounded-md
                       bg-white text-black font-mono font-bold text-md
                       "
                      onClick={() => setCoverImage(null)}
                    >
                      <TrashIcon aria-hidden="true" className="size-4" />
                    </div>
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Preview de la couverture"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Bouton personnalisé pour l'upload */}
                {!coverImage && (
                  <label
                    htmlFor="coverImage"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Choisir une image
                  </label>
                )}
              </>
            )}
          />
          {errors.coverImage && (
            <p className="text-sm text-red-500">
              {errors.coverImage?.message?.toString()}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={!isVisible || isLoading}
          className="flex justify-center w-full rounded-md py-1 px-2 text-sm md:text-base"
        >
          <span>{isLoading ? 'Chargement...' : 'Valider'}</span>
        </Button>
        <Button
          type="reset"
          disabled={!isVisible || isLoading}
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
