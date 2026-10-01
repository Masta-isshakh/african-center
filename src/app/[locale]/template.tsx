'use client';

import { useEffect, useState, type ReactNode } from 'react';

// The first paint must not wait for JavaScript (the hero headline is the LCP element),
// so only client-side navigations get the 240ms fade + 12px rise.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={animate ? 'route-enter' : undefined}>{children}</div>;
}
