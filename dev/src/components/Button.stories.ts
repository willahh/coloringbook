import type { Meta, StoryObj } from '@storybook/react';
import Button from '@components/Button';

const meta: Meta<typeof Button> = {
  title: 'Coloring book/components/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;


type Story = StoryObj<typeof Button>;

export const Btn: Story = {
  globals: {
    backgrounds: { value: 'dark' },
  }
};
