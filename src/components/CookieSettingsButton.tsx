'use client';

import React from 'react';
import { openCookieSettings } from './CookieBanner';

export function CookieSettingsButton({
  className = 'hover:text-(--accent-primary) transition-colors cursor-pointer',
  label = 'Cookie Settings',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  );
}

