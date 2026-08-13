import React from 'react';
import { Reveal, ProductCard } from '../ui';

export default function FeaturedProducts({ data }) {
  return (
    <section className="py-28 md:py-36 bg-paper">
      <div className="mx-auto max-w-400 px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8 mb-16 md:mb-24">
          <Reveal as="h2" className="font-serif tracking-tight leading-none text-[clamp(2.25rem,5vw,4.5rem)]" {...(data.$?.title)}>
            {data.title}
          </Reveal>
          <Reveal as="p" effect="fade" delay={200} className="eyebrow">
            {String(data.products?.length || 0).padStart(2, '0')} pieces
          </Reveal>
        </div>

        {/* Mirrored editorial rhythm: wide look / narrow portrait, alternating */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16 md:gap-y-28 items-end">
          {data.products?.map((product, idx) => {
            const wide = idx % 2 === 0;
            const mirrored = idx % 4 >= 2;
            return (
              <Reveal
                key={product.uid || idx}
                delay={(idx % 2) * 150}
                className={
                  wide
                    ? `col-span-12 md:col-span-7 ${mirrored ? 'md:order-2' : ''}`
                    : `col-span-12 md:col-span-5 md:pb-24 ${mirrored ? 'md:order-1' : ''}`
                }
              >
                <ProductCard product={product} index={idx} aspect={wide ? 'aspect-4/3' : 'aspect-3/4'} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
