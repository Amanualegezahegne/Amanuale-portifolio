import { useState, useEffect, useRef } from 'react';

/**
 * useTypedEffect — cycles through an array of strings with a typewriter effect.
 *
 * @param {string[]} strings  - Array of strings to cycle through
 * @param {number}   speed    - Milliseconds per character typed/deleted (default 80)
 * @returns {string}           The current displayed text
 */
export function useTypedEffect(strings, speed = 80) {
  const [state, setState] = useState({
    text: '',
    sIdx: 0,
    cIdx: 0,
    deleting: false,
  });

  // Ref to track pause between finished typing and start of deletion
  const pausingRef = useRef(false);

  useEffect(() => {
    // Guard: empty array — return '' with no interval
    if (!strings || strings.length === 0) return;

    // Reduced-motion: rotate full strings every 3 s, no character animation
    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      let i = 0;
      setState(s => ({ ...s, text: strings[0] }));
      const id = setInterval(() => {
        i = (i + 1) % strings.length;
        setState(s => ({ ...s, text: strings[i] }));
      }, 3000);
      return () => clearInterval(id);
    }

    // Normal character-by-character animation
    const id = setInterval(() => {
      // Skip tick while pausing between full-string and deletion start
      if (pausingRef.current) return;

      setState(prev => {
        const current = strings[prev.sIdx];

        if (!prev.deleting) {
          // Typing forward
          const next = current.slice(0, prev.cIdx + 1);

          if (next === current) {
            // Full string reached — pause 1500 ms then start deleting
            pausingRef.current = true;
            setTimeout(() => {
              pausingRef.current = false;
              setState(s => ({ ...s, deleting: true }));
            }, 1500);
            // Keep text at full string, stay at same cIdx so deletion can track length
            return { ...prev, text: next };
          }

          return { ...prev, text: next, cIdx: prev.cIdx + 1 };
        } else {
          // Deleting backward
          const next = prev.text.slice(0, -1);

          if (next === '') {
            // Done deleting — advance to next string
            return {
              text: '',
              sIdx: (prev.sIdx + 1) % strings.length,
              cIdx: 0,
              deleting: false,
            };
          }

          return { ...prev, text: next };
        }
      });
    }, speed);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state.text;
}

/**
 * Default strings used in the Hero section.
 */
export const DEFAULT_TYPED_STRINGS = [
  'Software Engineering Student',
  'Full-Stack Developer',
  'Problem Solver',
  'Open Source Enthusiast',
];
