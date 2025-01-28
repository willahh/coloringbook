import React from 'react';

interface ButtonProps {
  /**
   * Le texte du bouton ou le contenu du bouton
   */
  children: React.ReactNode;

  /**
   * La fonction à éxecuter lorsque le bouton est cliqué.
   */
  onClick?: () => void;

  /**
   * Type du bouton, par défaut 'button'.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Si le bouton est en focus.
   */
  autoFocus?: boolean;

  /**
   * La classe CSS pour des styles supplémentaires.
   */
  className?: string;

  /**
   * Si le bouton est désactivé.
   */
  disabled?: boolean;

  /**
   * Référence pour le bouton.
   */
  ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type,
  autoFocus,
  className,
  disabled,
  ref,
}) => {
  const baseStyle = `py-3 px-6 rounded-md flex items-center space-x-4 select-none
    transition-all duration-300 ease-in-out 
    bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 border border-primary-200 dark:border-primary-800
    dark:hover:bg-primary-700 hover:bg-primary-300 dark:hover:text-white
    focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-primary-300 active:bg-primary-300 dark:active:bg-primary-700 focus:text-black dark:focus:text-white
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-primary-800`;
  const combinedStyle = `${baseStyle} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedStyle}
      disabled={disabled}
      {...(autoFocus ? { autoFocus: true } : {})}
      ref={ref}
    >
      {children}
    </button>
  );
};

export default Button;
