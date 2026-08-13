import React from 'react';
import { Reveal, ProductCard } from '../ui';

export default function CollectionHighlight({ data }) {
  const marqueeItems = Array.from({ length: 8 });

  return (
    <section className="py-28 md:py-36 bg-ink text-paper overflow-hidden">
      {/* Data-driven marquee strip */}
      {data.title && (
        <div className="border-y border-paper/15 py-5 mb-20 select-none" aria-hidden="true">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {marqueeItems.map((_, i) => (
              <span key={i} className="font-serif italic text-3xl md:text-4xl text-paper/70 px-8 flex items-center gap-16">
                {data.title} <span className="text-paper/30 not-italic text-xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-400 px-6 lg:px-12">
        <div className="max-w-3xl mb-20">
          <Reveal as="h2" className="font-serif tracking-tight leading-[1.02] text-[clamp(2.5rem,6vw,5.5rem)] mb-8" {...(data.$?.title)}>
            {data.title}
          </Reveal>
          {data.description && (
            <Reveal as="p" delay={180} className="font-serif italic text-xl md:text-2xl text-paper/70 leading-relaxed" {...(data.$?.description)}>
              {data.description}
            </Reveal>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-16">
          {data.products?.map((product, idx) => (
            <Reveal key={product.uid || idx} delay={idx * 140} className={idx === 1 ? 'sm:mt-20' : ''}>
              <ProductCard product={product} index={idx} dark />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
