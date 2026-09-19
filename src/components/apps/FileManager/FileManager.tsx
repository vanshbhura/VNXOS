import React from 'react';
import { useFileSystemStore } from '../../../store/fsStore';
import { useOSStore } from '../../../store/osStore';
import { getApp } from '../../../data/apps';
import FileManagerToolbar from './FileManagerToolbar';
import FileManagerSidebar from './FileManagerSidebar';
import FileGrid from './FileGrid';
import FileList from './FileList';
import PropertiesDialog from './PropertiesDialog';
import type { FileSystemNode } from '../../../types/fs';
import type { AppWindow } from '../../../types/os';
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL, openExternalLink } from '../../../data/socialLinks';

interface FileManagerProps {
  window: AppWindow;
}

export default function FileManager({ window: appWindow }: FileManagerProps) {
  // Instance state initialized from window.initialPath if provided
  const initialPath = appWindow.initialPath || '/home/vansh';
  const [currentPath, setCurrentPath] = React.useState<string>(initialPath);
  const [history, setHistory] = React.useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);
  
  // Use localStorage to persist view preference across instances and reloads
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('vnx-fs-viewMode') as 'grid' | 'list') || 'grid';
  });

  const [sortField, setSortField] = React.useState<'name' | 'type' | 'size' | 'modifiedDate'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [propertiesNode, setPropertiesNode] = React.useState<FileSystemNode | null>(null);
  // Clipboard state for cut/copy/paste
  const [clipboard, setClipboard] = React.useState<{ nodeId: string; mode: 'copy' | 'cut' } | null>(null);

  // State selectors — fine-grained to prevent infinite re-render loop
  const nodes = useFileSystemStore(s => s.nodes);
  const showHidden = useFileSystemStore(s => s.showHidden);
  // Action selectors — stable function references, won't cause extra renders
  const getChildren = useFileSystemStore(s => s.getChildren);
  const getNodeByPath = useFileSystemStore(s => s.getNodeByPath);
  const createFolder = useFileSystemStore(s => s.createFolder);
  const createTextFile = useFileSystemStore(s => s.createTextFile);
  const renameNode = useFileSystemStore(s => s.renameNode);
  const moveToTrash = useFileSystemStore(s => s.moveToTrash);
  const restoreFromTrash = useFileSystemStore(s => s.restoreFromTrash);
  const emptyTrash = useFileSystemStore(s => s.emptyTrash);
  const deleteNode = useFileSystemStore(s => s.deleteNode);
  const copyNode = useFileSystemStore(s => s.copyNode);
  const showContextMenu = useOSStore(s => s.showContextMenu);
  const hideContextMenu = useOSStore(s => s.hideContextMenu);
  const openWindow = useOSStore(s => s.openWindow);

  void showHidden;

  React.useEffect(() => {
    localStorage.setItem('vnx-fs-viewMode', viewMode);
  }, [viewMode]);

  // Derived state
  const currentDirNode = React.useMemo(() => getNodeByPath(currentPath), [currentPath, nodes]);
  const isTrash = currentPath === '/home/vansh/Trash' || currentDirNode?.id === 'trash';

  const children = React.useMemo(() => {
    if (!currentDirNode && !searchQuery) return [];
    
    let items: FileSystemNode[] = [];
    if (searchQuery.trim()) {
       const query = searchQuery.toLowerCase();
       items = Object.values(nodes).filter(n => n.name.toLowerCase().includes(query) && n.id !== 'root' && !n.hidden);
    } else {
       items = getChildren(currentDirNode!.id);
    }

    return items.sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      
      let res = 0;
      switch (sortField) {
        case 'name': res = a.name.localeCompare(b.name); break;
        case 'type': res = (a.extension || '').localeCompare(b.extension || ''); break;
        case 'size': res = (a.size || 0) - (b.size || 0); break;
        case 'modifiedDate': res = new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime(); break;
      }
      return sortOrder === 'asc' ? res : -res;
    });
  }, [currentDirNode, getChildren, searchQuery, nodes, sortField, sortOrder]);

  // Navigation handlers
  const navigateTo = (path: string) => {
    if (path === currentPath) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSearchQuery('');
    setSelectedIds(new Set());
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSearchQuery('');
      setSelectedIds(new Set());
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSearchQuery('');
      setSelectedIds(new Set());
    }
  };

  const goUp = () => {
    if (currentDirNode && currentDirNode.parentId) {
       const parent = nodes[currentDirNode.parentId];
       if (parent) navigateTo(parent.path);
    }
  };

  // Double click handling for files/folders
  const handleItemDoubleClick = (node: FileSystemNode) => {
    if (node.name === 'GitHub' || node.id === 'desktop_github') {
      openExternalLink(GITHUB_PROFILE_URL);
      return;
    }
    if (node.name === 'LinkedIn' || node.id === 'desktop_linkedin') {
      openExternalLink(LINKEDIN_PROFILE_URL);
      return;
    }

    const appMap: Record<string, string> = {
      'Projects': 'projects',
      'About Me': 'about',
      'About': 'about',
      'Experience': 'experience',
      'Certificates': 'certificates',
      'Certification': 'certifications',
      'Resources': 'resources',
      'AI Tools': 'ai-tools',
      'Notes.txt': 'notes',
      'Notes': 'notes',
      'Trash': 'trash',
      'Terminal': 'terminal',
      'Command Prompt': 'cmd',
      'CMD': 'cmd',
      'PowerShell': 'powershell'
    };

    const targetAppId = appMap[node.name];
    if (targetAppId) {
      const app = getApp(targetAppId);
      if (app) {
        openWindow(app);
        return;
      }
    }

    if (node.type === 'folder' || node.targetPath) {
      navigateTo(node.targetPath || node.path);
    } else if (node.extension === '.pdf') {
      const app = getApp('resume');
      if (app) openWindow(app);
      else setPropertiesNode(node);
    } else {
      // Show properties/preview
      setPropertiesNode(node);
    }
  };

  const handleCreateFolder = () => {
    if (!currentDirNode) return;
    const name = prompt('Folder name:', 'New Folder');
    if (name && name.trim()) createFolder(name.trim(), currentDirNode.id);
  };

  const handleCreateTextFile = () => {
    if (!currentDirNode) return;
    const name = prompt('File name:', 'New Text File.txt');
    if (name && name.trim()) createTextFile(name.trim(), currentDirNode.id);
  };

  const handleNewWindow = () => {
    const app = getApp('file-manager');
    if (app) openWindow(app, undefined, currentPath, true);
  };

  const handleEmptyTrash = () => {
    if (confirm('Are you sure you want to permanently delete all items in Trash?')) {
      emptyTrash();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node?: FileSystemNode) => {
    e.preventDefault();
    e.stopPropagation();

    // If clicking a node, ensure it's selected
    if (node && !selectedIds.has(node.id)) {
      setSelectedIds(new Set([node.id]));
    }

    const nodeInTrash = isTrash || node?.parentId === 'trash';

    const items = node ? [
      { id: 'open', label: 'Open', action: () => handleItemDoubleClick(node) },
      { id: 'sep1', label: '---', separator: true, action: () => {} },
      ...(nodeInTrash ? [
        { id: 'restore', label: 'Restore from Trash', action: () => restoreFromTrash(node.id) },
        { id: 'delete-perm', label: 'Delete Permanently', action: () => deleteNode(node.id) },
      ] : [
        { id: 'copy', label: 'Copy', action: () => setClipboard({ nodeId: node.id, mode: 'copy' }) },
        { id: 'cut', label: 'Cut', action: () => setClipboard({ nodeId: node.id, mode: 'cut' }) },
        { id: 'sep2', label: '---', separator: true, action: () => {} },
        { id: 'rename', label: 'Rename', action: () => {
            const newName = prompt('Enter new name:', node.name);
            if (newName && newName.trim() && newName !== node.name) renameNode(node.id, newName.trim());
          }
        },
        { id: 'delete', label: 'Move to Trash', action: () => moveToTrash(node.id) },
      ]),
      { id: 'properties', label: 'Properties', separator: true, action: () => setPropertiesNode(node) },
    ] : [
      ...(isTrash ? [
        { id: 'empty-trash', label: 'Empty Trash', action: handleEmptyTrash },
      ] : [
        { id: 'new-folder', label: 'New Folder', action: handleCreateFolder },
        { id: 'new-file', label: 'New Text File', action: handleCreateTextFile },
        { id: 'new-window', label: 'New Window', action: handleNewWindow },
        ...(clipboard && currentDirNode ? [{
          id: 'paste',
          label: `Paste${clipboard.mode === 'cut' ? ' (Move)' : ''}`,
          separator: true,
          action: () => {
            if (clipboard.mode === 'copy') {
              copyNode(clipboard.nodeId, currentDirNode.id);
            } else {
              const srcNode = nodes[clipboard.nodeId];
              if (srcNode && srcNode.parentId !== currentDirNode.id) {
                useFileSystemStore.getState().moveNode(clipboard.nodeId, currentDirNode.id);
              }
              setClipboard(null);
            }
          }
        }] : []),
      ]),
      { id: 'properties', label: 'Properties', separator: true, action: () => {
          if (currentDirNode) setPropertiesNode(currentDirNode);
        } 
      },
    ];

    showContextMenu(e.clientX, e.clientY, items);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-200 overflow-hidden text-sm" onClick={hideContextMenu}>
      <FileManagerToolbar 
        currentPath={currentPath}
        navigateTo={navigateTo}
        goBack={goBack}
        goForward={goForward}
        goUp={goUp}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        canGoUp={!!currentDirNode?.parentId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewFolder={handleCreateFolder}
        onNewFile={handleCreateTextFile}
        onNewWindow={handleNewWindow}
        onEmptyTrash={handleEmptyTrash}
        isTrash={isTrash}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <FileManagerSidebar currentPath={currentPath} navigateTo={navigateTo} />
        
        <div className="flex-1 flex flex-col bg-slate-950/50 relative overflow-hidden" onContextMenu={(e) => handleContextMenu(e)}>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" onClick={() => setSelectedIds(new Set())}>
            {children.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                {searchQuery ? "No matching items found." : (isTrash ? "Trash is empty." : "This folder is empty.")}
              </div>
            ) : viewMode === 'grid' ? (
              <FileGrid 
                items={children} 
                selectedIds={selectedIds} 
                setSelectedIds={setSelectedIds} 
                onDoubleClick={handleItemDoubleClick}
                onContextMenu={handleContextMenu}
              />
            ) : (
              <FileList 
                items={children} 
                selectedIds={selectedIds} 
                setSelectedIds={setSelectedIds}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={(field) => {
                  if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortField(field); setSortOrder('asc'); }
                }}
                onDoubleClick={handleItemDoubleClick}
                onContextMenu={handleContextMenu}
              />
            )}
          </div>
          
          <div className="h-6 bg-slate-900 border-t border-white/5 flex items-center px-4 text-xs text-slate-400">
             {children.length} item{children.length !== 1 && 's'} 
             {selectedIds.size > 0 && ` | ${selectedIds.size} selected`}
          </div>
        </div>
      </div>
      
      {propertiesNode && (
        <PropertiesDialog node={propertiesNode} onClose={() => setPropertiesNode(null)} />
      )}
    </div>
  );
}
