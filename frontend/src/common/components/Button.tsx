import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  autoFocus,
  className = '',
  disabled,
  variant = 'primary',
  ...props
}) => {
  // Base styles that are common to all variants
  const commonStyles = `
    py-3 px-6 rounded-md flex items-center space-x-4 select-none
    transition-all duration-300 ease-in-out 
    focus:outline-none focus:ring-2 focus:text-black dark:focus:text-white
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variant-specific styles
  const variantStyles =
    {
      primary: `
      bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 border border-primary-200 dark:border-primary-800
      hover:bg-primary-300 dark:hover:bg-primary-700 dark:hover:text-white
      focus:ring-primary-700 dark:focus:ring-primary-300
      active:bg-primary-300 dark:active:bg-primary-700 disabled:bg-primary-800
    `,
      secondary: `
      bg-secondary-100 dark:bg-secondary-500 text-secondary-900 dark:text-secondary-100 border border-secondary-200 dark:border-secondary-800
      hover:bg-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white
      focus:ring-secondary-700 dark:focus:ring-secondary-300
      active:bg-secondary-300 dark:active:bg-secondary-700 disabled:bg-secondary-800
    `,
    }[variant] || ''; // Fallback to empty string if variant doesn't exist

  // Construct the combined style
  const combinedStyle = `${commonStyles} ${variantStyles} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedStyle}
      disabled={disabled}
      {...(autoFocus ? { autoFocus: true } : {})}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
