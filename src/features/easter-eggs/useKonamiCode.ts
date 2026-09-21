import { useEffect, useRef } from 'react';
import { useEasterEggStore } from './easterEggStore';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const RESET_TIMEOUT_MS = 2500;

export function useKonamiCode() {
  const triggerKonami = useEasterEggStore((s) => s.triggerKonami);
  const sequenceIndexRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Input safety: Ignore keystrokes if the active element is an input, textarea, or editable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          target.isContentEditable
        ) {
          // Reset sequence when actively typing in fields
          sequenceIndexRef.current = 0;
          return;
        }
      }

      // Ignore modifier combinations like Ctrl+B or Alt+A so shortcuts aren't hijacked
      if (e.ctrlKey || e.altKey || e.metaKey) {
        sequenceIndexRef.current = 0;
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI_SEQUENCE[sequenceIndexRef.current];

      // Reset timer on any keypress
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }

      if (key === expected) {
        sequenceIndexRef.current += 1;

        // Completed sequence!
        if (sequenceIndexRef.current === KONAMI_SEQUENCE.length) {
          sequenceIndexRef.current = 0;
          triggerKonami();
          return;
        }

        // Set timeout to reset sequence if paused too long
        resetTimerRef.current = window.setTimeout(() => {
          sequenceIndexRef.current = 0;
        }, RESET_TIMEOUT_MS);
      } else {
        // If mismatched, check if key is the start of the sequence ('ArrowUp')
        if (key === KONAMI_SEQUENCE[0]) {
          sequenceIndexRef.current = 1;
          resetTimerRef.current = window.setTimeout(() => {
            sequenceIndexRef.current = 0;
          }, RESET_TIMEOUT_MS);
        } else {
          sequenceIndexRef.current = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, [triggerKonami]);
}
