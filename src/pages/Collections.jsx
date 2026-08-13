import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout';
import { getCollectionsRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import { Reveal, SplitWords, PageLoader, ErrorState } from '../components/ui';

export default function Collections() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await getCollectionsRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching collections page:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    onEntryChange(() => {
      fetchData();
    });
  }, []);

  if (loading) {
    return (
      <Layout loading>
        <PageLoader label="Curating the index" />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ErrorState title="Index unavailable">
          <p>Failed to load the curated collections from Contentstack.</p>
        </ErrorState>
      </Layout>
    );
  }

  const { heading, subheading, background_image, reference } = data;

  return (
    <Layout>
      <div className="flex flex-col w-full">
        {/* Cinematic banner */}
        <div className="relative w-full min-h-[60svh] flex items-end overflow-hidden bg-ink text-paper" {...(data.$?.background_image)}>
          {background_image?.url && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={`${background_image.url}?format=webply&quality=85`}
                alt={background_image.title || 'Collections banner'}
                className="w-full h-full object-cover opacity-60 animate-kenburns"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/30" />
            </div>
          )}

          <div className="relative z-10 w-full mx-auto max-w-400 px-6 lg:px-12 pb-16 pt-40">
            <p className="eyebrow text-paper/70! mb-6" {...(data.$?.subheading)}>
              {subheading}
            </p>
            <h1 className="font-serif tracking-tight leading-[0.95] text-[clamp(3rem,8vw,7.5rem)]" {...(data.$?.heading)}>
              <SplitWords text={heading} delay={100} />
            </h1>
          </div>
        </div>

        {/* Asymmetric editorial index */}
        <div className="mx-auto max-w-400 w-full px-6 lg:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-20">
            {reference?.map((category, idx) => {
              const catTitle = category.title || category.name;
              const catImage = category.image?.url;
              const linkDest = category.url || `/collections/${category.slug}`;

              return (
                <Reveal
                  key={category.uid || idx}
                  delay={(idx % 2) * 150}
                  className={idx % 2 === 1 ? 'md:mt-32' : ''}
                >
                  <Link to={linkDest} className="group block">
                    <div className="relative aspect-4/5 overflow-hidden bg-cream mb-8" {...(category.$?.image)}>
                      {catImage ? (
                        <img
                          src={`${catImage}?format=webply&quality=85`}
                          alt={catTitle}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-1400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif italic text-mist">
                          Image to come
                        </div>
                      )}
                      <span className="absolute top-5 left-5 text-[10px] tracking-[0.3em] font-medium text-paper mix-blend-difference">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-6">
                      <h3
                        className="font-serif tracking-tight text-3xl md:text-4xl group-hover:italic transition-all"
                        {...(category.$?.title)}
                      >
                        {catTitle}
                      </h3>
                      <span className="eyebrow shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        Explore →
                      </span>
                    </div>

                    {category.description && (
                      <p className="text-ink-soft leading-relaxed mt-5 line-clamp-2 max-w-md" {...(category.$?.description)}>
                        {category.description}
                      </p>
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
