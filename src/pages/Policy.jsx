import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPolicyRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';
import { Reveal, SplitWords, PageLoader, ErrorState } from '../components/ui';

export default function Policy() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const url = `/policies/${slug}`;
      const response = await getPolicyRes(url);
      setData(response);
    } catch (err) {
      console.error("Error fetching individual policy:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    onEntryChange(() => {
      fetchData();
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <PageLoader label="Reading the fine print" />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ErrorState title="Policy not found">
          <p className="mb-8">We couldn't find a policy at “{slug}”.</p>
          <Link to="/policies" className="btn-ink btn-solid">All policies</Link>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="mx-auto max-w-400 px-6 lg:px-12 pt-24 md:pt-36 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 eyebrow mb-16">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-line">/</span>
          <Link to="/policies" className="hover:text-ink transition-colors">Policies</Link>
          <span className="text-line">/</span>
          <span className="text-ink truncate max-w-48" {...(data.$?.title)}>{data.title}</span>
        </nav>

        {/* Masthead */}
        <header className="max-w-4xl mb-20 md:mb-28">
          {data.effective_date && (
            <p className="eyebrow mb-8">
              Effective {new Date(data.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <h1
            className="font-serif tracking-tight leading-[0.98] text-[clamp(2.75rem,6.5vw,6rem)] mb-8"
            {...(data.$?.title)}
          >
            <SplitWords text={data.title} />
          </h1>
          {data.summary && (
            <p
              className="font-serif italic text-xl md:text-2xl text-ink-soft leading-relaxed max-w-2xl"
              {...(data.$?.summary)}
            >
              {data.summary}
            </p>
          )}
        </header>

        {/* Body sections */}
        <div className="max-w-3xl space-y-20">
          {data.body_sections?.map((block, idx) => {
            // Render Anchor Links
            if (block.anchor_link_section) {
              return (
                <div
                  key={idx}
                  id={block.anchor_link_section.anchor_id}
                  className="scroll-mt-32"
                />
              );
            }

            // Render Rich Text Sections
            if (block.rich_text_section) {
              return (
                <Reveal key={idx} as="section">
                  {block.rich_text_section.heading && (
                    <h2
                      className="font-serif tracking-tight text-3xl md:text-4xl border-b border-line pb-6 mb-8"
                      {...(block.rich_text_section.$?.heading)}
                    >
                      {block.rich_text_section.heading}
                    </h2>
                  )}

                  {/* The Utils.jsonToHTML modifies the object to include the raw HTML string if jsonRtePath is provided in API helper. If not, it falls back. */}
                  {typeof block.rich_text_section.body === 'string' ? (
                    <div
                      className="editorial-prose"
                      dangerouslySetInnerHTML={{ __html: block.rich_text_section.body }}
                      {...(block.rich_text_section.$?.body)}
                    />
                  ) : (
                    <div className="border border-accent/40 text-accent p-4 text-sm">
                      Rich Text Parsing Error: Ensure `jsonRtePath` is configured in the Contentstack `api.js` loader.
                    </div>
                  )}
                </Reveal>
              );
            }

            return null;
          })}
        </div>
      </article>
    </Layout>
  );
}
