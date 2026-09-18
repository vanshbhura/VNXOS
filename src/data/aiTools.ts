export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  icon: string;
}

export const aiToolsData: AITool[] = [
  {
    id: 'ai-1',
    name: 'ChatGPT',
    description: 'Conversational AI by OpenAI.',
    category: 'Language Models',
    website: 'https://chat.openai.com',
    icon: 'MessageSquare',
  },
  {
    id: 'ai-2',
    name: 'Midjourney',
    description: 'AI image generator.',
    category: 'Image Generation',
    website: 'https://midjourney.com',
    icon: 'Image',
  },
  {
    id: 'ai-3',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer.',
    category: 'Developer Tools',
    website: 'https://github.com/features/copilot',
    icon: 'Code',
  },
  {
    id: 'ai-4',
    name: 'LangChain',
    description: 'Framework for developing applications powered by LLMs.',
    category: 'Frameworks',
    website: 'https://langchain.com',
    icon: 'Link',
  }
];
