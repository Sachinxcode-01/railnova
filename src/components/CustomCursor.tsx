'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 380, mass: 0.4 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 380, mass: 0.4 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tag = target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) {
        setHidden(true);
        setLabel(null);
        return;
      }

      setHidden(false);
      const cursorHost = target.closest('[data-cursor-label]') as HTMLElement | null;
      setLabel(cursorHost?.dataset.cursorLabel || null);
    };

    const onLeave = () => setHidden(true);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorX, cursorY]);

  if (!enabled || hidden) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {label ? (
        <div className="px-3 py-1 rounded-full bg-[var(--accent-primary)] text-[var(--accent-on-primary)] text-[11px] font-semibold tracking-wider uppercase shadow-lg">
          {label}
        </div>
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border border-[var(--accent-primary)] bg-[var(--accent-primary)]/20 backdrop-blur-xs" />
      )}
    </motion.div>
  );
}
