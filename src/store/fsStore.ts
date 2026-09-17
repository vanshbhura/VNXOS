import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FileSystemNode, FileSystemStore } from '../types/fs';
import { getInitialFsNodesMap } from '../data/initialFs';

const generateId = () => crypto.randomUUID();

// Rebuild paths based on parents
const rebuildPaths = (nodes: Record<string, FileSystemNode>, startId: string) => {
  const node = nodes[startId];
  if (!node) return;

  const parent = node.parentId ? nodes[node.parentId] : null;
  const newPath = parent ? (parent.path === '/' ? `/${node.name}` : `${parent.path}/${node.name}`) : `/${node.name}`;
  
  nodes[startId].path = newPath;

  // Recursively update children
  Object.values(nodes)
    .filter(n => n.parentId === startId)
    .forEach(child => rebuildPaths(nodes, child.id));
};

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      nodes: getInitialFsNodesMap(),
      showHidden: false,

      createFolder: (name, parentId) => set((state) => {
        const id = generateId();
        const parent = state.nodes[parentId];
        if (!parent) return state;

        const path = parent.path === '/' ? `/${name}` : `${parent.path}/${name}`;
        
        // Prevent duplicates
        const exists = Object.values(state.nodes).some(n => n.parentId === parentId && n.name === name);
        if (exists) {
          console.warn(`Folder ${name} already exists in ${parent.path}`);
          return state;
        }

        const newNode: FileSystemNode = {
          id,
          name,
          type: 'folder',
          parentId,
          path,
          modifiedDate: new Date().toISOString(),
        };

        return { nodes: { ...state.nodes, [id]: newNode } };
      }),

      createTextFile: (name, parentId, content = '') => set((state) => {
        const id = generateId();
        const parent = state.nodes[parentId];
        if (!parent) return state;

        const path = parent.path === '/' ? `/${name}` : `${parent.path}/${name}`;
        
        // Prevent duplicates
        const exists = Object.values(state.nodes).some(n => n.parentId === parentId && n.name === name);
        if (exists) {
          console.warn(`File ${name} already exists in ${parent.path}`);
          return state;
        }

        const newNode: FileSystemNode = {
          id,
          name,
          type: 'file',
          parentId,
          path,
          extension: name.includes('.') ? name.substring(name.lastIndexOf('.')) : '.txt',
          mimeType: 'text/plain',
          size: new Blob([content]).size,
          modifiedDate: new Date().toISOString(),
          content,
        };

        return { nodes: { ...state.nodes, [id]: newNode } };
      }),

      renameNode: (id, newName) => set((state) => {
        const node = state.nodes[id];
        if (!node || newName.trim() === '') return state;

        // Prevent duplicates in same dir
        const exists = Object.values(state.nodes).some(n => n.parentId === node.parentId && n.name === newName && n.id !== id);
        if (exists) return state;

        const newNodes = { ...state.nodes };
        newNodes[id] = { 
          ...node, 
          name: newName,
          modifiedDate: new Date().toISOString()
        };
        
        if (node.type === 'file' && newName.includes('.')) {
           newNodes[id].extension = newName.substring(newName.lastIndexOf('.'));
        }

        rebuildPaths(newNodes, id);

        return { nodes: newNodes };
      }),

      deleteNode: (id) => set((state) => {
        const newNodes = { ...state.nodes };
        
        // Recursive delete
        const deleteRecursive = (nodeId: string) => {
          Object.values(newNodes)
            .filter(n => n.parentId === nodeId)
            .forEach(child => deleteRecursive(child.id));
          delete newNodes[nodeId];
        };
        
        deleteRecursive(id);
        return { nodes: newNodes };
      }),

      moveToTrash: (id) => set((state) => {
        const node = state.nodes[id];
        const trashDir = Object.values(state.nodes).find(n => n.path === '/home/vansh/Trash');
        
        if (!node || !trashDir || node.parentId === trashDir.id) return state;

        const newNodes = { ...state.nodes };
        newNodes[id] = {
          ...node,
          originalParentId: node.parentId,
          parentId: trashDir.id,
          modifiedDate: new Date().toISOString()
        };
        
        rebuildPaths(newNodes, id);
        return { nodes: newNodes };
      }),

      restoreFromTrash: (id) => set((state) => {
        const node = state.nodes[id];
        if (!node || !node.originalParentId) return state;

        const targetParent = state.nodes[node.originalParentId];
        const finalParentId = targetParent ? targetParent.id : 'vansh'; // fallback to home/vansh

        const newNodes = { ...state.nodes };
        newNodes[id] = {
          ...node,
          parentId: finalParentId,
          originalParentId: null,
          modifiedDate: new Date().toISOString()
        };
        
        rebuildPaths(newNodes, id);
        return { nodes: newNodes };
      }),

      emptyTrash: () => set((state) => {
        const trashDir = Object.values(state.nodes).find(n => n.path === '/home/vansh/Trash');
        if (!trashDir) return state;

        const newNodes = { ...state.nodes };
        Object.values(newNodes)
          .filter(n => n.parentId === trashDir.id)
          .forEach(n => {
            const deleteRecursive = (nodeId: string) => {
              Object.values(newNodes).filter(c => c.parentId === nodeId).forEach(c => deleteRecursive(c.id));
              delete newNodes[nodeId];
            };
            deleteRecursive(n.id);
          });
          
        return { nodes: newNodes };
      }),

      moveNode: (id, newParentId) => set((state) => {
        const node = state.nodes[id];
        const parent = state.nodes[newParentId];
        if (!node || !parent || node.id === newParentId || node.parentId === newParentId) return state;

        // Prevent moving a folder into its own child
        let isChild = false;
        let curr = parent;
        while (curr.parentId) {
          if (curr.parentId === id) {
             isChild = true;
             break;
          }
          curr = state.nodes[curr.parentId];
        }
        if (isChild) return state;

        const newNodes = { ...state.nodes };
        newNodes[id] = {
          ...node,
          parentId: newParentId,
          modifiedDate: new Date().toISOString()
        };
        
        rebuildPaths(newNodes, id);
        return { nodes: newNodes };
      }),

      copyNode: (id, newParentId) => set((state) => {
        const node = state.nodes[id];
        const parent = state.nodes[newParentId];
        if (!node || !parent) return state;

        const newNodes = { ...state.nodes };

        const copyRecursive = (nodeToCopy: FileSystemNode, destParentId: string) => {
          const newId = generateId();
          let newName = nodeToCopy.name;
          
          if (destParentId === nodeToCopy.parentId) {
            // we are copying in the same dir, append " - Copy"
            newName = `${nodeToCopy.name} - Copy`;
          }

          const destParent = newNodes[destParentId];
          const newPath = destParent.path === '/' ? `/${newName}` : `${destParent.path}/${newName}`;

          const copiedNode: FileSystemNode = {
            ...nodeToCopy,
            id: newId,
            name: newName,
            parentId: destParentId,
            path: newPath,
            modifiedDate: new Date().toISOString()
          };
          newNodes[newId] = copiedNode;

          Object.values(state.nodes)
            .filter(n => n.parentId === nodeToCopy.id)
            .forEach(child => copyRecursive(child, newId));
        };

        copyRecursive(node, newParentId);
        return { nodes: newNodes };
      }),

      toggleHidden: () => set((state) => ({ showHidden: !state.showHidden })),

      getNodeByPath: (path) => {
        const nodes = get().nodes;
        return Object.values(nodes).find(n => n.path === path);
      },

      getChildren: (parentId) => {
        const state = get();
        return Object.values(state.nodes).filter(n => 
          n.parentId === parentId && 
          (!n.hidden || state.showHidden)
        );
      }
    }),
    {
      name: 'vnx-fs-v3', // Versioned key: bump this to wipe old stale data
      // Safe merge: persist user-created nodes on top of base static portfolio nodes
      merge: (persistedState: unknown, currentState: FileSystemStore): FileSystemStore => {
        try {
          if (!persistedState || typeof persistedState !== 'object') return currentState;
          const ps = persistedState as Record<string, unknown>;
          const pNodes = ps.nodes;
          if (!pNodes || typeof pNodes !== 'object') return currentState;
          
          const mergedNodes = { ...currentState.nodes };

          for (const id in pNodes as Record<string, unknown>) {
            const pNode = (pNodes as Record<string, unknown>)[id];
            // Validate the node has the minimum required fields before accepting it
            if (
              pNode &&
              typeof pNode === 'object' &&
              'id' in (pNode as object) &&
              'name' in (pNode as object) &&
              'type' in (pNode as object) &&
              'path' in (pNode as object) &&
              'modifiedDate' in (pNode as object)
            ) {
              mergedNodes[id] = { ...mergedNodes[id], ...(pNode as FileSystemNode) };
            }
          }

          return {
            ...currentState,
            nodes: mergedNodes,
          };
        } catch (e) {
          console.warn('[VNX.OS fsStore] Failed to merge persisted state, resetting to defaults.', e);
          return currentState;
        }
      }
    }
  )
);
