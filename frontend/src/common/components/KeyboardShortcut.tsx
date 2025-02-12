// src/components/KeyboardShortcut.tsx
import React from 'react';
import { KeyIcon } from '@heroicons/react/24/outline'; // Utilisation d'une icône de clavier de Heroicons

interface KeyboardShortcutProps {
  keys: string[]; // Array of keys, like ['Ctrl', 'S']
  description?: string; // Description of the shortcut
  className?: string; // Optional class for additional styling
}

const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  keys,
  description,
  className = '',
}) => {
  return (
    <span
      className={`flex items-center space-x-0.5 text-xs relative top-[0.1em] -left-2 scale-75 ${className}`}
    >
      <KeyIcon className="w-3 h-3 text-gray-400" />
      <span className="flex items-center space-x-0.5">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-1 py-0 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-sm hover:no-underline"
            style={{ fontSize: '8px' }}
          >
            {key}
          </kbd>
        ))}
      </span>
      {description && <span className="text-gray-600">{description}</span>}
    </span>
  );
};

export default KeyboardShortcut;
