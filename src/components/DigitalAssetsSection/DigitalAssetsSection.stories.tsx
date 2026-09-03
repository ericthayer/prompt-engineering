import type { Meta, StoryObj } from '@storybook/react-vite';
import { DigitalAssetsSection } from './DigitalAssetsSection';

const meta: Meta<typeof DigitalAssetsSection> = {
  title: 'Components/DigitalAssetsSection',
  component: DigitalAssetsSection,
};

export default meta;
type Story = StoryObj<typeof DigitalAssetsSection>;

export const Default: Story = {};
