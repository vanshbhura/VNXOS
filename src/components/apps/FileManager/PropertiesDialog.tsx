import React from 'react';
import { X } from 'lucide-react';
import type { FileSystemNode } from '../../../types/fs';
import { getIconForNode } from './FileGrid';
import { useFileSystemStore } from '../../../store/fsStore';

interface PropertiesDialogProps {
  node: FileSystemNode;
  onClose: () => void;
}

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return '--';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i] + ` (${bytes} bytes)`;
};

export default function PropertiesDialog({ node, onClose }: PropertiesDialogProps) {
  const nodes = useFileSystemStore(s => s.nodes);
  
  // Calculate size for folders recursively
  const getFolderSize = (folderId: string): { size: number, count: number } => {
    const children = Object.values(nodes).filter(n => n.parentId === folderId);
    let size = 0;
    let count = children.length;
    
    for (const child of children) {
      if (child.type === 'file') {
        size += child.size || 0;
      } else {
        const sub = getFolderSize(child.id);
        size += sub.size;
        count += sub.count;
      }
    }
    return { size, count };
  };

  let displaySize = formatSize(node.size);
  let displayCount = '';
  
  if (node.type === 'folder') {
     const { size, count } = getFolderSize(node.id);
     displaySize = formatSize(size);
     displayCount = `${count} item${count !== 1 ? 's' : ''}`;
  }

  const d = new Date(node.modifiedDate);
  const formattedDate = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="w-[360px] bg-slate-900 border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden text-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-white/5">
          <span className="font-semibold text-slate-200">{node.name} Properties</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="shrink-0 scale-[1.5] origin-top-left ml-2">
              {getIconForNode(node)}
            </div>
            <div className="flex flex-col ml-8 min-w-0">
              <span className="text-lg font-medium text-slate-100 truncate">{node.name}</span>
              <span className="text-slate-400 capitalize">
                {node.type === 'folder' ? 'File Folder' : `${node.extension || 'Unknown'} File`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4 text-slate-300 items-center border-b border-white/5 pb-4">
            <span className="text-slate-500">Location:</span>
            <span className="truncate" title={node.path}>{node.path.substring(0, node.path.lastIndexOf('/')) || '/'}</span>
            
            <span className="text-slate-500">Size:</span>
            <span>{displaySize}</span>
            
            {node.type === 'folder' && (
              <>
                <span className="text-slate-500">Contains:</span>
                <span>{displayCount}</span>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4 text-slate-300">
            <span className="text-slate-500">Modified:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-slate-950/50 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded text-slate-200 transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
