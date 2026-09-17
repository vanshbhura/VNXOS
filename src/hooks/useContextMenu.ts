import { useEffect, useCallback } from 'react';
import { useOSStore } from '../store/osStore';
import type { ContextMenuItem } from '../types/os';

export function useContextMenu() {
  const showContextMenu = useOSStore((s) => s.showContextMenu);
  const hideContextMenu = useOSStore((s) => s.hideContextMenu);

  const show = useCallback(
    (e: React.MouseEvent, items: ContextMenuItem[]) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(e.clientX, e.clientY, items);
    },
    [showContextMenu]
  );

  useEffect(() => {
    const handler = () => hideContextMenu();
    window.addEventListener('click', handler);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideContextMenu();
    });
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [hideContextMenu]);

  return { show, hide: hideContextMenu };
}
