// client/src/hooks/useHashRoute.js

import { useEffect, useState } from 'react';

function parseRoute() {
  const h = (window.location.hash || '').replace(/^#\/?/, '');
  if (h.startsWith('papers')) return 'papers';
  if (h.startsWith('preview')) return 'preview';
  return 'home';
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseRoute);
  
  useEffect(() => {
    const handler = () => setRoute(parseRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  
  return route;
}
