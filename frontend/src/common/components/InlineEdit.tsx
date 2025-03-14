import React, { useState, useCallback } from 'react';

interface InlineEditProps {
  value: string;
  onEdit: (newValue: string) => void;
  className?: string;
}

const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onEdit,
  className = '',
}) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(event.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onEdit(currentValue);
        setEditing(false);
      } else if (event.key === 'Escape') {
        setCurrentValue(value);
        setEditing(false);
      }
    },
    [currentValue, value, onEdit]
  );

  const handleBlur = useCallback(() => {
    onEdit(currentValue);
    setEditing(false);
  }, [currentValue, onEdit]);

  if (editing) {
    return (
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus
        className={`w-full max-w-10 lg:max-w-5xl border rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    );
  } else {
    return (
      <span
        onClick={() => setEditing(true)}
        className={`truncate max-w-10 lg:max-w-5xl inline-block cursor-text transition-all hover:text-black dark:hover:text-white ${className}`}
      >
        {value}
      </span>
    );
  }
};

export default InlineEdit;
