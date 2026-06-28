import { useEffect } from 'react';

/**
 * useScrollReveal
 *
 * Observes an array of refs and adds the `is-visible` CSS class when each
 * element enters the viewport. Supports staggered reveal delays and respects
 * the `prefers-reduced-motion` user preference.
 *
 * @param {React.RefObject[]} refs     - Array of React refs to observe.
 * @param {object}            options
 * @param {number}  [options.threshold=0.15]  - IntersectionObserver threshold.
 * @param {number}  [options.staggerMs=100]   - ms delay increment per index.
 */
export function useScrollReveal(refs, { threshold = 0.15, staggerMs = 100 } = {}) {
  useEffect(() => {
    // Respect the user's motion preference
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apply base class and stagger delay to every valid ref
    refs.forEach((ref, i) => {
      if (!ref || !ref.current) return;
      ref.current.classList.add('reveal-item');
      ref.current.style.setProperty('--reveal-delay', `${i * staggerMs}ms`);

      // If reduced motion: show everything immediately without observer
      if (prefersReduced) {
        ref.current.classList.add('is-visible');
      }
    });

    // Skip observer when reduced motion is active
    if (prefersReduced) return;

    // Fallback: if IntersectionObserver is not available, show all immediately
    if (typeof IntersectionObserver === 'undefined') {
      refs.forEach((ref) => {
        if (!ref || !ref.current) return;
        ref.current.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    refs.forEach((ref) => {
      if (!ref || !ref.current) return;
      observer.observe(ref.current);
    });

    // Disconnect observer when the component unmounts
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
