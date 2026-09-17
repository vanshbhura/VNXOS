import React from 'react';
import type { FileSystemNode } from '../../../types/fs';
import * as Icons from 'lucide-react';

interface FileGridProps {
  items: FileSystemNode[];
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onDoubleClick: (node: FileSystemNode) => void;
  onContextMenu?: (e: React.MouseEvent, node: FileSystemNode) => void;
}

export function getIconForNode(node: FileSystemNode) {
  if (node.type === 'folder') {
    if (node.icon && Icons[node.icon as keyof typeof Icons]) {
       const Icon = Icons[node.icon as keyof typeof Icons] as React.ElementType;
       return <Icon className="text-blue-400" size={48} strokeWidth={1} />;
    }
    return <Icons.Folder className="text-blue-400" size={48} strokeWidth={1} fill="currentColor" fillOpacity={0.2} />;
  }
  
  if (node.extension === '.pdf') return <Icons.FileText className="text-red-400" size={48} strokeWidth={1} />;
  if (node.extension === '.txt') return <Icons.FileText className="text-slate-300" size={48} strokeWidth={1} />;
  if (node.extension === '.png' || node.extension === '.jpg' || node.extension === '.webp') return <Icons.Image className="text-purple-400" size={48} strokeWidth={1} />;
  
  return <Icons.File className="text-slate-400" size={48} strokeWidth={1} />;
}

export default function FileGrid({ items, selectedIds, setSelectedIds, onDoubleClick, onContextMenu }: FileGridProps) {
  
  const handleItemClick = (e: React.MouseEvent, node: FileSystemNode) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      const newSet = new Set(selectedIds);
      if (newSet.has(node.id)) newSet.delete(node.id);
      else newSet.add(node.id);
      setSelectedIds(newSet);
    } else {
      setSelectedIds(new Set([node.id]));
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
      {items.map((node) => {
        const isSelected = selectedIds.has(node.id);
        
        return (
          <div
            key={node.id}
            onClick={(e) => handleItemClick(e, node)}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(node); }}
            onContextMenu={(e) => onContextMenu?.(e, node)}
            className={`
              flex flex-col items-center justify-start p-2 rounded-lg cursor-default select-none text-center
              hover:bg-white/5 transition-colors border border-transparent
              ${isSelected ? 'bg-white/10 border-white/20' : ''}
              ${node.hidden ? 'opacity-50' : ''}
            `}
          >
            <div className="mb-2">
              {getIconForNode(node)}
            </div>
            <div className="w-full truncate px-1 text-slate-200">
              {node.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
