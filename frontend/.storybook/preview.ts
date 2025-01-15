import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import '../src/main.css'; // Importing the main css!
import './storybook.css'; // Override body background to white

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
