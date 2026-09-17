import React from 'react';
import type { FileSystemNode, SortField, SortOrder } from '../../../types/fs';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getIconForNode } from './FileGrid';

interface FileListProps {
  items: FileSystemNode[];
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onDoubleClick: (node: FileSystemNode) => void;
  onContextMenu?: (e: React.MouseEvent, node: FileSystemNode) => void;
}

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return '--';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (isoStr: string) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function FileList({ items, selectedIds, setSelectedIds, sortField, sortOrder, onSort, onDoubleClick, onContextMenu }: FileListProps) {
  
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="w-full text-left border-collapse">
      {/* Header */}
      <div className="grid grid-cols-[minmax(200px,2fr)_1fr_1fr_minmax(150px,1fr)] gap-4 px-4 py-2 border-b border-white/10 text-slate-400 font-semibold select-none sticky top-0 bg-slate-950/95 z-10">
        <div className="cursor-pointer hover:text-slate-200" onClick={() => onSort('name')}>
          Name <SortIcon field="name" />
        </div>
        <div className="cursor-pointer hover:text-slate-200" onClick={() => onSort('modifiedDate')}>
          Date Modified <SortIcon field="modifiedDate" />
        </div>
        <div className="cursor-pointer hover:text-slate-200" onClick={() => onSort('type')}>
          Type <SortIcon field="type" />
        </div>
        <div className="cursor-pointer hover:text-slate-200 text-right" onClick={() => onSort('size')}>
          Size <SortIcon field="size" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {items.map((node) => {
          const isSelected = selectedIds.has(node.id);
          return (
            <div
              key={node.id}
              onClick={(e) => handleItemClick(e, node)}
              onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(node); }}
              onContextMenu={(e) => onContextMenu?.(e, node)}
              className={`
                grid grid-cols-[minmax(200px,2fr)_1fr_1fr_minmax(150px,1fr)] gap-4 px-4 py-2 border-b border-white/5 
                hover:bg-white/5 cursor-default select-none items-center
                ${isSelected ? 'bg-white/10' : ''}
                ${node.hidden ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="scale-50 -ml-3 -my-3">{getIconForNode(node)}</div>
                <span className="truncate text-slate-200">{node.name}</span>
              </div>
              <div className="text-slate-400 truncate">{formatDate(node.modifiedDate)}</div>
              <div className="text-slate-400 truncate capitalize">
                {node.type === 'folder' ? 'Folder' : (node.extension ? `${node.extension.slice(1).toUpperCase()} File` : 'File')}
              </div>
              <div className="text-slate-400 text-right">{node.type === 'folder' ? '--' : formatSize(node.size)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
