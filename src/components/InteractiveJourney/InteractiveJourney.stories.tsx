import type { Meta, StoryObj } from '@storybook/react';
import { InteractiveJourney } from './InteractiveJourney';

const meta: Meta<typeof InteractiveJourney> = {
  title: 'Components/InteractiveJourney',
  component: InteractiveJourney,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveJourney>;

export const Default: Story = {};
