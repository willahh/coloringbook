import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import '../src/main.css'; // Importing the main css!
import './storybook.css'; // Override body background to white

// export const parameters = {
//   darkMode: {
//     classTarget: 'html',
//     darkClass: 'lights-out',
//     lightClass: 'lights-on',
//   },
// };

const preview: Preview = {
  parameters: {
    // darkMode: {
    //   classTarget: 'html',
    //   darkClass: 'lights-out',
    //   lightClass: 'lights-on',
    // },
    docs: {
      theme: themes.dark,
    },
    // options: {
    //   storySort: {
    //     /** FIXME: Sort folders */
    //     // order: ['Coloring book/base/Icons', 'Coloring book/components/Button'],
    //     // order: ['Coloring book/base', 'Coloring book/components'],
    //     // order: ['base', 'components'],
    //     // order: ['Icons', 'Typography', 'Btn'],
    //     // order: ['*', 'components'],
    //   },
    // },
    //   // The `a` and `b` arguments in this function have a type of `import('@storybook/types').IndexEntry`. Remember that the function is executed in a JavaScript environment, so use JSDoc for IntelliSense to introspect it.
    //   storySort: (a, b) =>
    //     a.id === b.id
    //       ? 0
    //       : a.id.localeCompare(b.id, undefined, { numeric: true }),
    // },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
