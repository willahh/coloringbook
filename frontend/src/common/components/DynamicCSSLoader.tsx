/**
 * DynamicCSSLoader component dynamically loads a CSS file based on the provided theme.
 *
 * @param {Object} props - Component props
 * @param {'light' | 'dark'} props.theme - The theme to load the CSS for
 *
 * @example
 * <DynamicCSSLoader theme="light" />
 */
import React, { useEffect } from 'react';

type Props = {
  theme: 'light' | 'dark';
};

const DynamicCSSLoader: React.FC<Props> = ({ theme }) => {
  useEffect(() => {
    const loadCSS = async () => {
      try {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `/main.${theme}.css`; // Assurez-vous que le chemin est correct
        document.head.appendChild(cssLink);

        return () => {
          document.head.removeChild(cssLink);
        };
      } catch (error) {
        console.error('Failed to load CSS', error);
      }
    };

    loadCSS();
  }, [theme]);

  return null; // Ce composant ne rend rien directement
};

export default DynamicCSSLoader;
