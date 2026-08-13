import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../ui';

export default function ImageText({ data }) {
  return (
    <section className="py-28 md:py-36 bg-cream overflow-hidden">
      <div className="mx-auto max-w-400 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal effect="mask" className="md:col-span-7 aspect-4/5 md:aspect-5/6 overflow-hidden">
            {data.image && (
              <img
                src={`${data.image.url}?format=webply&quality=85`}
                alt={data.image.title || 'Editorial image'}
                loading="lazy"
                className="w-full h-full object-cover"
                {...(data.image.$?.url)}
              />
            )}
          </Reveal>

          <div className="md:col-span-5 flex flex-col items-start">
            <Reveal effect="line" className="w-16 h-px bg-ink mb-10" />
            <Reveal
              as="h2"
              delay={100}
              className="font-serif tracking-tight leading-[1.05] text-[clamp(2.25rem,4.5vw,4rem)] mb-8"
              {...(data.$?.title)}
            >
              {data.title}
            </Reveal>

            {data.description && (
              <Reveal
                as="p"
                delay={220}
                className="text-lg text-ink-soft leading-loose max-w-lg mb-10"
                {...(data.$?.description)}
              >
                {data.description}
              </Reveal>
            )}

            {data.cta_label && data.cta_link && (
              <Reveal delay={340}>
                <Link
                  to={data.cta_link.href}
                  className="eyebrow text-ink! link-sweep"
                  {...(data.$?.cta_label)}
                >
                  {data.cta_label} →
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
