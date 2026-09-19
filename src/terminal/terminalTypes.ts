import type React from 'react';
import type { FileSystemStore } from '../types/fs';

export type ShellType = 'bash' | 'cmd' | 'powershell';

export type TerminalTheme = 'dark' | 'light' | 'high-contrast';

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'custom';
  content: React.ReactNode;
  prompt?: string;
}

export interface CommandContext {
  cwd: string;
  setCwd: (newPath: string) => void;
  fs: FileSystemStore;
  history: string[];
  theme: TerminalTheme;
  setTheme: (theme: TerminalTheme) => void;
  clear: () => void;
  exit?: () => void;
  shellType: ShellType;
}

export interface CommandResult {
  output?: React.ReactNode;
  error?: string;
}

export interface CommandDefinition {
  name: string;
  description: string;
  aliases?: string[];
  usage?: string;
  execute: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult> | void;
}

export interface ShellDefinition {
  type: ShellType;
  name: string;
  title: string;
  formatPrompt: (cwd: string) => string;
  welcomeBanner?: React.ReactNode;
  formatCommandNotFound: (command: string) => string;
  commands: Record<string, CommandDefinition>;
}
