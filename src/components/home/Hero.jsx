import React from 'react';
import { Link } from 'react-router-dom';
import { SplitWords } from '../ui';

export default function HeroSection({ data }) {
  return (
    <section className="relative bg-paper overflow-hidden">
      <div className="mx-auto max-w-400 px-6 lg:px-12 pt-12 md:pt-20 pb-16 md:pb-24">
        {/* Oversized headline */}
        <h1
          className="relative z-10 font-serif tracking-tight leading-[0.9] text-ink text-[clamp(3.5rem,11.5vw,11.5rem)] mb-10 md:mb-0"
          {...(data.$?.heading)}
        >
          <SplitWords text={data.heading} delay={150} step={90} italicLast />
        </h1>

        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          {/* Lede + CTA fill the left column */}
          <div className="col-span-12 md:col-span-4 order-2 md:order-1 md:pt-16 flex flex-col items-start gap-10">
            {data.subheading && (
              <p
                className="font-serif italic text-xl md:text-2xl leading-relaxed text-ink-soft max-w-sm opacity-0"
                style={{ animation: 'page-in 1s cubic-bezier(0.22,1,0.36,1) 0.7s both' }}
                {...(data.$?.subheading)}
              >
                {data.subheading}
              </p>
            )}

            {data.cta_label && data.cta_link && (
              <div className="opacity-0" style={{ animation: 'page-in 1s cubic-bezier(0.22,1,0.36,1) 0.9s both' }}>
                <Link to={data.cta_link.href} className="btn-ink btn-solid" {...(data.$?.cta_label)}>
                  {data.cta_label}
                </Link>
              </div>
            )}

            <div
              className="hidden md:flex items-center gap-4 mt-auto pb-2 opacity-0"
              style={{ animation: 'page-in 1s cubic-bezier(0.22,1,0.36,1) 1.2s both' }}
              aria-hidden="true"
            >
              <span className="eyebrow">Scroll</span>
              <span className="block w-16 h-px bg-ink/40" />
            </div>
          </div>

          {/* Cover image, tucked up under the headline */}
          <div className="col-span-12 md:col-span-8 order-1 md:order-2 relative overflow-hidden bg-cream aspect-4/5 sm:aspect-3/2 md:-mt-[clamp(2rem,5vw,6rem)] animate-unmask">
            {data.background_image && (
              <img
                src={`${data.background_image.url}?format=webply&quality=85`}
                alt={data.background_image.title || 'Hero'}
                className="w-full h-full object-cover animate-kenburns"
                {...(data.background_image.$?.url)}
              />
            )}
            {/* paper scrim keeps the overlapping headline legible on any image */}
            <div className="absolute inset-x-0 top-0 h-28 md:h-40 bg-linear-to-b from-paper/90 via-paper/35 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
