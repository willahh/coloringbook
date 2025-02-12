// AnimatedText.tsx
import React from 'react';
import { Transition } from '@headlessui/react';

interface AnimatedTextProps {
  children: React.ReactNode; // Accepte un ou plusieurs éléments React comme enfants
  show?: boolean; // Prop optionnelle pour contrôler la visibilité
  enterClassName?: string; // Prop optionnelle pour définir la classe CSS d'entrée
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  show = true,
  enterClassName,
}) => {
  return (
    <Transition
      appear={true}
      show={show}
      enter={`transition-all duration-500 ease-out ${enterClassName}`}
      enterFrom="opacity-0 -translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-500 ease-in"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="-translate-x-full"
    >
      {children}
    </Transition>
  );
};

export default AnimatedText;
