import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloudSection } from './CloudSection';

const meta: Meta<typeof CloudSection> = {
  title: 'Components/CloudSection',
  component: CloudSection,
};

export default meta;
type Story = StoryObj<typeof CloudSection>;

export const Default: Story = {};
