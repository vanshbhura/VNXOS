import type { DockItemDef } from '../types/os';

export const dockItems: DockItemDef[] = [
  {
    id: 'launcher',
    label: 'App Launcher',
    icon: 'LayoutGrid',
    appId: 'launcher',
  },
  {
    id: 'files',
    label: 'File Manager',
    icon: 'FolderOpen',
    appId: 'projects',
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: 'Globe',
    appId: 'browser',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: 'Terminal',
    appId: 'terminal',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    icon: 'Code2',
    appId: 'vscode',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    icon: 'Music',
    appId: 'spotify',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    appId: 'settings',
  },
  {
    id: 'trash',
    label: 'Trash',
    icon: 'Trash2',
    appId: 'trash',
  },
];
