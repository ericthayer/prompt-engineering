import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import App from './App';

const meta: Meta<typeof App> = {
  title: 'Pages/AppLanding',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const headings = [
      'Master AI Prompting',
      'The Three C’s of Prompt Writing',
      'Precision & Powerful Phrases',
      'Prompt Chaining',
      'Use New Chats for New Topics',
      'Managing Context Drift',
      'Improve Results Through Iteration',
      'Key Takeaways',
      'Always Evaluate the Output',
    ];

    for (const heading of headings) {
      await expect(canvas.getByRole('heading', { name: heading })).toBeInTheDocument();
    }

    await expect(canvas.getByRole('link', { name: 'Learn the Framework' })).toHaveAttribute(
      'href',
      '#framework',
    );

    const accuracy = canvas.getByRole('checkbox', { name: /accuracy/i });
    await userEvent.click(accuracy);
    await expect(accuracy).toBeChecked();

    await userEvent.click(canvas.getByRole('button', { name: 'Reset checklist' }));
    await expect(accuracy).not.toBeChecked();
  },
};
