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
   * La classe CSS pour des styles supplémentaires.
   */
  className?: string;

  /**
   * Si le bouton est désactivé.
   */
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type,
  className,
  disabled,
}) => {
  const baseStyle =
    // 'flex px-4 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 active:bg-blue-700';
    `py-3 px-6 rounded-lg flex items-center space-x-4 
    bg-indigo-500 text-white
    transition-all duration-300 ease-in-out 
    hover:bg-indigo-600 
    focus:outline-none focus:ring-2 focus:ring-indigo-300 active:bg-indigo-700`;
  const combinedStyle = `${baseStyle} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
