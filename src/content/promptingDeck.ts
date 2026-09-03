export const promptingDeck = {
  hero: {
    title: 'Master AI Prompting',
    description:
      'Effective prompting relies on a clear framework: Persona, Task, Format, and Context. Combine this with iterative refinement to consistently guide AI to accurate, high-quality results.',
    cta: 'Learn the Framework',
  },
  threeCs: {
    title: 'The Three C’s of Prompt Writing',
    items: [
      {
        title: 'Be Concise',
        description: 'Keep prompts simple and avoid overly long or complex requests in a single prompt.',
      },
      {
        title: 'Be Clear',
        description:
          'Be precise and avoid contradictory or ambiguous instructions. Give specific directions to guide the AI.',
      },
      {
        title: 'Be Consistent',
        description:
          'Use the same vocabulary for the same concepts throughout your conversation (e.g., don\'t mix "spreadsheet" and "matrix").',
      },
    ],
  },
  powerPhrases: {
    title: 'Precision & Powerful Phrases',
    description:
      "There are no magic words, but certain phrases are more effective. Powerful prompt phrases don't just tell AI what to do. They guide how AI should get there by adding precision, setting boundaries, and forcing AI to use more complex reasoning paths.",
    example:
      'Before answering, identify the assumptions, constraints, and missing context that could affect the result.',
  },
  chaining: {
    title: 'Prompt Chaining',
    description:
      "Don't ask for everything at once. Prompt chaining uses a series of smaller, connected prompts to structure an entire conversation and break down massive, complex projects step-by-step.",
    items: ['Define the outcome', 'Draft one focused part', 'Review the result', 'Refine the next prompt'],
  },
  contextWindow: {
    title: 'Use New Chats for New Topics',
    description:
      'A context window is the limit of how much information AI can retain. Because of this, you should always start a new chat when changing topics. If you switch to a completely new topic within the same chat, AI might use unrelated earlier context and generate misguided responses.',
  },
  drift: {
    title: 'Managing Context Drift',
    items: [
      {
        title: 'Context',
        description:
          'Provide accurate and up-to-date context in your prompts, especially for fast-changing topics.',
      },
      {
        title: 'Focus',
        description:
          'Keep chats focused by starting a new conversation for each specific task to reset the context window.',
      },
      {
        title: 'Explicitness',
        description: 'Be explicit with clear and specific instructions.',
      },
    ],
  },
  iteration: {
    title: 'Improve Results Through Iteration',
    description: 'AI outputs are a starting point, not a final product.',
    items: [
      {
        title: 'Revisit the framework',
        description: 'Add detail to your persona, task, format, or context.',
      },
      {
        title: 'Break up tasks',
        description: 'Ask for smaller pieces one at a time.',
      },
      {
        title: 'Add constraints',
        description: 'Add specific requirements the AI must meet to narrow its focus.',
      },
    ],
  },
  takeaways: {
    title: 'Key Takeaways',
    items: [
      {
        title: 'Structure Your Approach',
        description: 'Always define the Persona, Task, Format, and Context.',
      },
      {
        title: "Master the 3 C's",
        description: 'Keep prompts Concise, Clear, and Consistent.',
      },
      {
        title: 'Guide the Reasoning',
        description: 'Use powerful phrases and prompt chaining to dictate how the AI thinks.',
      },
      {
        title: 'Protect Your Context',
        description: 'Stick to one topic per chat to prevent AI drift.',
      },
      {
        title: 'Iterate',
        description: 'Treat the first output as a draft, refine your constraints, and prompt again.',
      },
    ],
  },
  evaluation: {
    title: 'Always Evaluate the Output',
    description: 'Before using or sharing AI output, read through to ensure it fulfills your request.',
    items: [
      {
        key: 'accuracy',
        title: 'Accuracy',
        description: 'Is the information correct and factually sound?',
      },
      {
        key: 'bias',
        title: 'Bias',
        description: 'Does the output favor one perspective unfairly based on training data?',
      },
      {
        key: 'relevancy',
        title: 'Relevancy',
        description: 'Does it directly answer your prompt and stay on topic?',
      },
      {
        key: 'consistency',
        title: 'Consistency',
        description: 'Is the tone, style, and quality the same throughout?',
      },
    ],
  },
} as const;

export type EvaluationKey = (typeof promptingDeck.evaluation.items)[number]['key'];
