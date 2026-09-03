import { useEffect } from 'react';

export function DeckHashNavigation() {
  useEffect(() => {
    const navigateToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const scrollRoot = target?.closest('main');
      if (!target || !scrollRoot) return;
      scrollRoot.scrollTop = target.offsetTop;
    };

    navigateToHash();
    window.addEventListener('hashchange', navigateToHash);

    return () => {
      window.removeEventListener('hashchange', navigateToHash);
    };
  }, []);

  return null;
}
