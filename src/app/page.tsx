'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { SmartBookingPanel } from '@/components/SmartBookingPanel';
import { StorytellingSection } from '@/components/landing/StorytellingSection';
import { FeaturesBentoSection } from '@/components/landing/FeaturesBentoSection';
import { RailwayTimelineSection } from '@/components/landing/RailwayTimelineSection';
import { ProductShowcaseSection } from '@/components/landing/ProductShowcaseSection';
import { RouteNetworkSection } from '@/components/landing/RouteNetworkSection';
import { DestinationsSection } from '@/components/landing/DestinationsSection';
import { NovaAIDemoSection } from '@/components/landing/NovaAIDemoSection';
import { DigitalTicketSection } from '@/components/landing/DigitalTicketSection';
import { SecuritySection } from '@/components/landing/SecuritySection';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO EXPERIENCE */}
      <section
        ref={heroRef}
        className="relative min-h-[88svh] sm:min-h-[94vh] flex flex-col justify-center lg:justify-end pt-20 pb-8 sm:pt-24 sm:pb-12 overflow-hidden bg-[#0C0D10] text-[#F8F9FC]"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=75"
            alt="High-speed passenger train moving through atmospheric evening landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-50 scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(12,13,16,0.72) 0%, rgba(12,13,16,0.45) 45%, rgba(12,13,16,0.96) 100%)',
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 400"
            className="pointer-events-none absolute bottom-0 left-0 right-0 w-full opacity-20"
            preserveAspectRatio="none"
          >
            <line x1="620" y1="0" x2="120" y2="400" stroke="#D4FF3F" strokeWidth="1.2" />
            <line x1="820" y1="0" x2="1320" y2="400" stroke="#D4FF3F" strokeWidth="1.2" />
            <line x1="720" y1="0" x2="720" y2="400" stroke="#9296A3" strokeWidth="0.6" strokeDasharray="8 12" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-340 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          <div className="max-w-4xl space-y-4 sm:space-y-5">
            <div className="hero-stagger inline-flex items-center gap-2.5 rounded-full border border-[#2A2D35] bg-[#17191F]/80 px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-widest text-[#9296A3]">
              <span className="h-2 w-2 rounded-full bg-[#D4FF3F]" />
              <span>RailNova · Next-Gen Indian Rail</span>
            </div>

            <h1 className="hero-stagger font-display text-4xl sm:text-7xl lg:text-[84px] font-bold tracking-[-0.035em] leading-[0.95]">
              THE JOURNEY.
              <br />
              <span className="text-[#D4FF3F]">REDEFINED.</span>
            </h1>

            <p className="hero-stagger max-w-xl text-sm sm:text-lg text-[#9296A3] leading-relaxed">
              Explore more. Travel smarter. Experience railway journeys like never before across India’s fastest corridors.
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#smart-booking"
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4FF3F] px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#0C0D10] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Find My Train</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-lg border border-[#2A2D35] bg-[#17191F]/80 px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-semibold text-[#F8F9FC] hover:border-[#D4FF3F] transition-colors cursor-pointer"
              >
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>

          <div id="smart-booking" className="hero-stagger">
            <SmartBookingPanel />
          </div>
        </div>
      </section>

          {/* 1. Problem and solution — Scroll-driven storytelling */}
          <StorytellingSection />

      {/* 2. Platform features — Interactive bento grid */}
      <FeaturesBentoSection />

          {/* 3. How it works — Animated railway timeline */}
          <RailwayTimelineSection />

      {/* 4. Product showcase — Interactive application previews */}
      <ProductShowcaseSection />

          {/* 5. Railway map — Animated route network */}
          <RouteNetworkSection />

            {/* 6. Destinations — Luxury travel photography */}
            <DestinationsSection />

            {/* 7. Nova AI — Interactive chat demonstration */}
            <NovaAIDemoSection />

      {/* 8. Digital tickets — Ticket-printing animation */}
      <DigitalTicketSection />

      {/* 9. Security — Minimal professional layout */}
      <SecuritySection />
    </div>
  );
}
