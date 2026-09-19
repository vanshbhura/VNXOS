import type { FileSystemNode } from '../types/fs';

/**
 * Normalizes simulated Windows and Unix paths into an absolute VFS path.
 * VFS root is `/home/vansh` for user home.
 */
export function normalizeToVfsPath(rawPath: string, currentPath: string): string {
  let p = rawPath.trim();
  if (!p) return currentPath;

  // Handle Windows paths like C:\Users\vansh\...
  if (/^[a-zA-Z]:[\\\/]/.test(p)) {
    p = p.replace(/^[a-zA-Z]:[\\\/]Users[\\\/]vansh/i, '/home/vansh');
    p = p.replace(/^[a-zA-Z]:[\\\/]/i, '/');
    p = p.replace(/\\/g, '/');
  }

  // Handle ~ abbreviation
  if (p === '~') return '/home/vansh';
  if (p.startsWith('~/')) p = '/home/vansh' + p.substring(1);

  // If not starting with '/', treat as relative to currentPath
  if (!p.startsWith('/')) {
    p = currentPath === '/' ? `/${p}` : `${currentPath}/${p}`;
  }

  // Normalize . and ..
  const parts = p.split('/').filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  return '/' + resolved.join('/');
}

/**
 * Converts an internal VFS path to a simulated Windows path.
 * e.g., /home/vansh -> C:\Users\vansh
 */
export function toWindowsPath(vfsPath: string): string {
  if (vfsPath === '/home/vansh' || vfsPath === '/home/vansh/') {
    return 'C:\\Users\\vansh';
  }
  if (vfsPath.startsWith('/home/vansh/')) {
    const sub = vfsPath.substring('/home/vansh/'.length).replace(/\//g, '\\');
    return `C:\\Users\\vansh\\${sub}`;
  }
  return 'C:' + vfsPath.replace(/\//g, '\\');
}

/**
 * Resolves a target path in the VFS and returns the matching node if found.
 */
export function findVfsNode(
  targetPath: string,
  currentPath: string,
  nodes: Record<string, FileSystemNode>
): FileSystemNode | undefined {
  const normalized = normalizeToVfsPath(targetPath, currentPath);
  return Object.values(nodes).find((n) => n.path === normalized);
}

/**
 * ASCII Neofetch display text
 */
export const NEOFETCH_ASCII = `
    ███╗   ██╗██╗   ██╗██╗  ██╗ ██████╗ ███████╗
    ████╗  ██║██║   ██║╚██╗██╔╝██╔═══██╗██╔════╝
    ██╔██╗ ██║██║   ██║ ╚███╔╝ ██║   ██║███████╗
    ██║╚██╗██║╚██╗ ██╔╝ ██╔██╗ ██║   ██║╚════██║
    ██║ ╚████║ ╚████╔╝ ██╔╝ ██╗╚██████╔╝███████║
    ╚═╝  ╚═══╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

export function getSystemInfoLines(): Array<{ label: string; value: string }> {
  return [
    { label: 'OS', value: 'VNX.OS (Web Desktop Simulator)' },
    { label: 'Host', value: 'Antigravity IDE Browser Runtime' },
    { label: 'Kernel', value: 'VNX React Virtual Kernel 6.0' },
    { label: 'Uptime', value: 'Client Session Active' },
    { label: 'Shell', value: 'VNX Simulated Shell Engine' },
    { label: 'Theme', value: 'Dark Linux / GNOME' },
    { label: 'Architecture', value: 'Web (TypeScript / Vite)' },
    { label: 'Developer', value: 'Vansh Bhura' },
  ];
}
