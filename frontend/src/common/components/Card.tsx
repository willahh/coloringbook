import { ReactNode } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

type type = 'success' | 'error' | 'info';

const getIcon = (type: type) => {
  switch (type) {
    case 'success':
      return (
        <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />
      );
    case 'error':
      return (
        <ExclamationCircleIcon
          aria-hidden="true"
          className="size-6 text-red-400"
        />
      );
    case 'info':
      return (
        <InformationCircleIcon
          aria-hidden="true"
          className="size-6 text-blue-400"
        />
      );
    default:
      return null;
  }
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: type;
  children?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, type }) => {
  return (
    <div
      className={`${className || ''} 
     shadow-2xl rounded-lg`}
    >
      {children}
    </div>
  );
};

export default Card;
