'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function RailTransitionBar() {
  const pathname = usePathname();
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 420);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, originX: 0, opacity: 1 }}
          animate={{ scaleX: 1, originX: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[var(--accent-primary)] pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
