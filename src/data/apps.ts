import type { AppDefinition } from '../types/os';

export const appRegistry: AppDefinition[] = [
  {
    id: 'projects',
    name: 'Projects',
    icon: 'FolderOpen',
    description: 'View portfolio projects',
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 600, height: 400 },
  },
  {
    id: 'about',
    name: 'About Me',
    icon: 'User',
    description: 'About Vansh Bhura',
    defaultSize: { width: 800, height: 580 },
    minSize: { width: 560, height: 380 },
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: 'Briefcase',
    description: 'Work experience timeline',
    defaultSize: { width: 820, height: 600 },
    minSize: { width: 600, height: 400 },
  },
  {
    id: 'certificates',
    name: 'Certificates',
    icon: 'Award',
    description: 'Certifications and achievements',
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 560, height: 380 },
  },
  {
    id: 'file-manager',
    name: 'Files',
    icon: 'Folder',
    description: 'VNX.OS File Manager',
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 600, height: 400 },
    component: 'FileManager',
    allowMultiple: true,
  },
  {
    id: 'resume',
    name: 'Resume.pdf',
    icon: 'FileText',
    description: 'View resume',
    defaultSize: { width: 780, height: 1000 },
    minSize: { width: 500, height: 600 },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    description: 'VNX.OS Terminal',
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 480, height: 320 },
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'StickyNote',
    description: 'Text editor / notes',
    defaultSize: { width: 640, height: 480 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    description: 'System settings',
    defaultSize: { width: 740, height: 520 },
    minSize: { width: 560, height: 380 },
  },
  {
    id: 'trash',
    name: 'Trash',
    icon: 'Trash2',
    description: 'Recycling bin',
    defaultSize: { width: 640, height: 420 },
    minSize: { width: 400, height: 300 },
  },
];

export function getApp(id: string): AppDefinition | undefined {
  return appRegistry.find((a) => a.id === id);
}
