import type { Meta, StoryObj } from '@storybook/react';
import { ContactBanner } from './ContactBanner';

const meta: Meta<typeof ContactBanner> = {
  title: 'Components/ContactBanner',
  component: ContactBanner,
};

export default meta;
type Story = StoryObj<typeof ContactBanner>;

export const Default: Story = {};
