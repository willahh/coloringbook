import React, { ReactNode } from 'react';

interface LinkProps {
  href?: string;
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  color?: 'default' | 'gray';
}

const ButtonLink: React.FC<LinkProps> = ({
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
    <a
      href={href}
      className={`${cls} hover:underline`}
    >
      {children}
    </a>
  ) : (
    <button
      className={`${cls} hover:underline`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
