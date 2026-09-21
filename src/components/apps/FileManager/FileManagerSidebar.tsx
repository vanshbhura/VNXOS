import React from 'react';
import { Home, Monitor, FolderOpen, Gamepad2, FileText, Download, Award, Trash2 } from 'lucide-react';

interface FileManagerSidebarProps {
  currentPath: string;
  navigateTo: (path: string) => void;
}

const SIDEBAR_LINKS = [
  { label: 'Home', path: '/home/vansh', icon: Home },
  { label: 'Desktop', path: '/home/vansh/Desktop', icon: Monitor },
  { label: 'Projects', path: '/home/vansh/Projects', icon: FolderOpen },
  { label: 'Games', path: '/home/vansh/Games', icon: Gamepad2 },
  { label: 'Documents', path: '/home/vansh/Documents', icon: FileText },
  { label: 'Downloads', path: '/home/vansh/Downloads', icon: Download },
  { label: 'Certificates', path: '/home/vansh/Certificates', icon: Award },
  { label: 'Trash', path: '/home/vansh/Trash', icon: Trash2 },
];

export default function FileManagerSidebar({ currentPath, navigateTo }: FileManagerSidebarProps) {
  return (
    <div className="w-48 bg-slate-900 border-r border-white/5 py-4 flex flex-col gap-1 select-none">
      <div className="px-4 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
        Quick Access
      </div>
      
      {SIDEBAR_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = currentPath === link.path || currentPath.startsWith(link.path + '/');
        
        return (
          <button
            key={link.path}
            onClick={() => navigateTo(link.path)}
            className={`
              flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors
              ${isActive ? 'bg-purple-500/20 text-purple-200 border-r-2 border-purple-500' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
            `}
          >
            <Icon size={16} className={isActive ? 'text-purple-400' : 'opacity-70'} />
            {link.label}
          </button>
        );
      })}
    </div>
  );
}
