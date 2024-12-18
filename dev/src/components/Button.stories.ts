import type { Meta, StoryObj } from '@storybook/react';
import Button from '@components/Button';

/* Settings */
const meta: Meta<typeof Button> = {
  title: 'Coloring book/components/Button',
  component: Button,
  tags: ['autodocs'],
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
  //   // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  //   args: { onClick: fn() },
};
export default meta;

/**
 * TODO:
 * - Colors
 * - Font
 * - Typo
 * - Card
 * - Button
 */

type Story = StoryObj<typeof Button>;

/* Stories */
export const Btn: Story = {
  globals: {
    // 👇 Override background value for this story
    backgrounds: { value: 'dark' },
  },
  args: {
    //   dataType: 'latency',
    //   showHistogramLabels: true,
    //   histogramAccentColor: '#1EA7FD',
    //   label: 'Latency distribution',
  },
};
