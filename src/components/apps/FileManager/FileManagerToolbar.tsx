import React from 'react';
import { 
  ArrowLeft, ArrowRight, ArrowUp, RefreshCw, Search, 
  LayoutGrid, List, FolderPlus, FilePlus, ExternalLink, Trash2 
} from 'lucide-react';

interface FileManagerToolbarProps {
  currentPath: string;
  navigateTo: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  goUp: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNewFolder?: () => void;
  onNewFile?: () => void;
  onNewWindow?: () => void;
  onEmptyTrash?: () => void;
  isTrash?: boolean;
}

export default function FileManagerToolbar({
  currentPath, navigateTo, goBack, goForward, goUp, canGoBack, canGoForward, canGoUp,
  viewMode, setViewMode, searchQuery, setSearchQuery,
  onNewFolder, onNewFile, onNewWindow, onEmptyTrash, isTrash
}: FileManagerToolbarProps) {

  const pathParts = currentPath.split('/').filter(Boolean);
  
  const handleBreadcrumbClick = (index: number) => {
    const newPath = '/' + pathParts.slice(0, index + 1).join('/');
    navigateTo(newPath);
  };

  return (
    <div className="h-12 bg-slate-900 border-b border-white/10 flex items-center px-2 shrink-0 gap-2 select-none">
      <div className="flex items-center gap-1">
        <button onClick={goBack} disabled={!canGoBack} title="Back" className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent">
          <ArrowLeft size={16} />
        </button>
        <button onClick={goForward} disabled={!canGoForward} title="Forward" className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent">
          <ArrowRight size={16} />
        </button>
        <button onClick={goUp} disabled={!canGoUp} title="Up" className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent">
          <ArrowUp size={16} />
        </button>
        <button onClick={() => navigateTo(currentPath)} title="Refresh" className="p-1.5 rounded hover:bg-white/10 ml-1">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Address Bar / Breadcrumbs */}
      <div className="flex-1 flex items-center bg-black/30 border border-white/5 rounded-md px-3 h-8 overflow-hidden text-sm">
        <button onClick={() => navigateTo('/')} className="hover:text-purple-400 truncate max-w-[100px]">
          Root
        </button>
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="mx-1 text-slate-600">/</span>
            <button 
              onClick={() => handleBreadcrumbClick(index)}
              className="hover:text-purple-400 truncate max-w-[150px]"
            >
              {part}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {isTrash ? (
          <button
            onClick={onEmptyTrash}
            title="Empty Trash"
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 rounded"
          >
            <Trash2 size={13} />
            <span>Empty Trash</span>
          </button>
        ) : (
          <>
            {onNewFolder && (
              <button onClick={onNewFolder} title="New Folder" className="p-1.5 rounded hover:bg-white/10 text-slate-300">
                <FolderPlus size={15} />
              </button>
            )}
            {onNewFile && (
              <button onClick={onNewFile} title="New Text File" className="p-1.5 rounded hover:bg-white/10 text-slate-300">
                <FilePlus size={15} />
              </button>
            )}
          </>
        )}
        {onNewWindow && (
          <button onClick={onNewWindow} title="Open New Window" className="p-1.5 rounded hover:bg-white/10 text-slate-300">
            <ExternalLink size={15} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-44">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/30 border border-white/5 rounded-md h-8 pl-8 pr-3 text-sm focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* View Toggle */}
      <div className="flex bg-black/30 border border-white/5 rounded-md p-0.5">
        <button 
          onClick={() => setViewMode('grid')}
          title="Grid View"
          className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <LayoutGrid size={14} />
        </button>
        <button 
          onClick={() => setViewMode('list')}
          title="List View"
          className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5 text-slate-400'}`}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  );
}
