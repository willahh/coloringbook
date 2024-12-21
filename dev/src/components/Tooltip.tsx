import React, { useCallback, useRef, useState, useEffect } from 'react';
import type * as PopperJS from '@popperjs/core';
import { usePopper } from 'react-popper';

type TooltipProps = {
  className?: string;
  label?: React.ReactElement;
  text?: string;
  placement?: PopperJS.Placement;
  enterDelay?: number;
  leaveDelay?: number;
  isVisible?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    children,
    label,
    text,
    className = 'bg-white p-2 rounded-md',
    enterDelay = 200,
    leaveDelay = 200,
    placement = 'bottom',
    isVisible = true,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
  });

  const enterTimeout = useRef<NodeJS.Timeout>();
  const leaveTimeout = useRef<NodeJS.Timeout>();
  const handleMouseEnter = useCallback(() => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    enterTimeout.current = setTimeout(() => setIsOpen(true), enterDelay);
  }, [enterDelay]);
  const handleMouseLeave = useCallback(() => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current);
    }
    leaveTimeout.current = setTimeout(() => setIsOpen(false), leaveDelay);
  }, [leaveDelay]);

  useEffect(() => {
    if (!isVisible) {
      console.log('useEffect setisOpen to false');
      setIsOpen(false);
    }
  }, [isVisible]);

  return (
    <div>
      <div
        ref={setReferenceElement}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {children}
      </div>

      {label ? (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={`transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </div>
      ) : text ? (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={`transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        >
          {text}
        </div>
      ) : null}
    </div>
  );
};
