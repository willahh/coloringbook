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
  const baseStyle = `py-3 px-6 rounded-md flex items-center space-x-4 
    bg-indigo-900 text-indigo-100 border border-indigo-800
    transition-all duration-300 ease-in-out 
    hover:bg-indigo-600 hover:text-white
    focus:outline-none focus:ring-2 focus:ring-indigo-300 active:bg-indigo-700 focus:text-white`;
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
