export type FileSystemNodeType = 'folder' | 'file';

export interface FileSystemNode {
  id: string;
  name: string;
  type: FileSystemNodeType;
  parentId: string | null;
  path: string; // The absolute path within VFS (e.g., /home/vansh/Desktop)
  icon?: string; // Optional custom icon name
  mimeType?: string;
  size?: number; // In bytes
  modifiedDate: string; // ISO date string
  extension?: string; // e.g., ".pdf", ".txt"
  executable?: boolean;
  hidden?: boolean;
  assetPath?: string; // For static portfolio files mapping to public/assets
  targetPath?: string; // Optional target path for shortcuts/links
  originalParentId?: string | null; // Used when in Trash to know where to restore
  metadata?: Record<string, any>;
  content?: string; // For text files
}

export interface FileSystemState {
  nodes: Record<string, FileSystemNode>; // id to node mapping for O(1) lookups
  showHidden: boolean;
}

export type SortField = 'name' | 'type' | 'size' | 'modifiedDate';
export type SortOrder = 'asc' | 'desc';

export interface FileSystemActions {
  createFolder: (name: string, parentId: string) => void;
  createTextFile: (name: string, parentId: string, content?: string) => void;
  renameNode: (id: string, newName: string) => void;
  deleteNode: (id: string) => void; // Permanent delete
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  emptyTrash: () => void;
  moveNode: (id: string, newParentId: string) => void;
  copyNode: (id: string, newParentId: string) => void;
  toggleHidden: () => void;
  
  // Helpers
  getNodeByPath: (path: string) => FileSystemNode | undefined;
  getChildren: (parentId: string) => FileSystemNode[];
}

export type FileSystemStore = FileSystemState & FileSystemActions;
