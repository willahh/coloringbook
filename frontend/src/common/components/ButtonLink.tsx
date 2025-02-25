import React, { ReactNode } from 'react';

interface LinkProps {
  className?: string;
  href?: string;
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  color?: 'default' | 'gray';
}

const ButtonLink: React.FC<LinkProps> = ({
  className,
  href,
  children,
  onClick,
  color = 'default',
}) => {
  const cls =
    color === 'default'
      ? 'text-secondary-600 hover:text-secondary-800'
      : 'text-gray-600 hover:text-gray-800';
  return href ? (
    <a href={href} className={`${cls} cursor-pointer underline ${className || ''}`}>
      {children}
    </a>
  ) : (
    <button
      className={`${cls} cursor-pointer underline ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
