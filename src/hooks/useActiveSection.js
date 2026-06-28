import { useState, useEffect } from 'react';

/**
 * useActiveSection
 *
 * Tracks which section is currently visible in the viewport using
 * IntersectionObserver. Returns the id of the currently active section.
 *
 * @param {string[]} sectionIds - Array of element ids to observe (e.g. ['Home','About','Projects','Contact'])
 * @returns {string} - The id of the currently intersecting section
 */
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(
    sectionIds && sectionIds.length > 0 ? sectionIds[0] : ''
  );

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-60px 0px -40% 0px',
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return active;
}
