import React, { useEffect, useState } from 'react';
import { getAboutPageRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';
import { Reveal, SplitWords, PageLoader, ErrorState } from '../components/ui';

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getAboutPageRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching about page:", err);
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
      <Layout>
        <PageLoader label="Turning the page" />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ErrorState title="Story unavailable">
          <p>We couldn't fetch the about page. Please try again shortly.</p>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="pt-24 md:pt-36 pb-10">
        {/* Editorial masthead */}
        <header className="mx-auto max-w-400 px-6 lg:px-12 mb-16 md:mb-24">
          <p className="eyebrow mb-8">The story</p>
          <h1
            className="font-serif tracking-tight leading-[0.98] text-[clamp(3rem,8vw,7.5rem)] max-w-5xl"
            {...(data.$?.page_title)}
          >
            <SplitWords text={data.page_title} />
          </h1>
        </header>

        {/* Full-bleed image */}
        {data.image && (
          <Reveal effect="mask" className="w-full aspect-video md:aspect-21/9 overflow-hidden mb-16 md:mb-24">
            <img
              src={`${data.image.url}?format=webply&quality=85`}
              alt={data.image.title || 'About Thread Theory'}
              className="w-full h-full object-cover"
              {...(data.image.$?.url)}
            />
          </Reveal>
        )}

        {/* Magazine body with drop cap */}
        {data.description && (
          <Reveal className="mx-auto max-w-3xl px-6">
            <div
              className="editorial-prose drop-cap"
              {...(data.$?.description)}
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </Reveal>
        )}
      </article>
    </Layout>
  );
}
