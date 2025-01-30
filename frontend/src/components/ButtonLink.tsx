import React, { ReactNode } from 'react';

interface LinkProps {
  href?: string;
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const ButtonLink: React.FC<LinkProps> = ({ href, children, onClick }) => {
  return href ? (
    <a
      href={href}
      className="text-secondary-600 hover:text-secondary-800 hover:underline"
    >
      {children}
    </a>
  ) : (
    <button
      className="text-secondary-600 hover:text-secondary-800 hover:underline"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
