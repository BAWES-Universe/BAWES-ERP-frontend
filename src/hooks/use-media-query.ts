'use client';

import { useState, useEffect } from 'react';

/**
 * Hook that returns whether the current viewport matches the given media query.
 * Used for responsive design decisions — sidebar vs mobile tab bar, etc.
 *
 * @param query - CSS media query string, e.g. '(max-width: 760px)'
 * @returns boolean indicating if the query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 760px)');
 * if (isMobile) return <MobileNav />;
 * return <Sidebar />;
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Avoid SSR mismatch
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
