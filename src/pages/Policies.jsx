import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPoliciesListingRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';
import { Reveal, SplitWords, PageLoader, ErrorState } from '../components/ui';

export default function Policies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getPoliciesListingRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching policies listing page:", err);
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
        <PageLoader label="Reading the fine print" />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ErrorState title="Policies unavailable">
          <p>Failed to fetch the policies listing. Please try again shortly.</p>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-400 px-6 lg:px-12 pt-24 md:pt-36 pb-10">
        {/* Masthead */}
        <header className="mb-20 md:mb-28 max-w-4xl">
          <p className="eyebrow mb-8">The fine print</p>
          <h1
            className="font-serif tracking-tight leading-[0.98] text-[clamp(3rem,7vw,6.5rem)] mb-8"
            {...(data.$?.title)}
          >
            <SplitWords text={data.title} />
          </h1>
          {data.description && (
            <p
              className="font-serif italic text-xl md:text-2xl text-ink-soft leading-relaxed max-w-2xl"
              {...(data.$?.description)}
            >
              {data.description}
            </p>
          )}
        </header>

        {/* Numbered index */}
        {data.policies?.length ? (
          <div className="border-t border-line">
            {data.policies.map((policy, idx) => {
              const title = policy.title || policy.name || 'Legal policy';
              const summary = policy.summary || 'Review our terms and conditions.';
              const url = policy.url || '/policies/';

              return (
                <Reveal key={policy.uid || idx} delay={idx * 80}>
                  <Link
                    to={url}
                    className="group grid grid-cols-12 items-baseline gap-4 py-10 border-b border-line hover:bg-cream transition-colors duration-500 px-2 md:px-6"
                  >
                    <span className="col-span-2 md:col-span-1 text-[10px] tracking-[0.3em] font-medium text-mist">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="col-span-10 md:col-span-4 font-serif tracking-tight text-2xl md:text-3xl group-hover:italic transition-all"
                      {...(policy.$?.title)}
                    >
                      {title}
                    </h3>
                    <p
                      className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto text-ink-soft leading-relaxed line-clamp-2"
                      {...(policy.$?.summary)}
                    >
                      {summary}
                    </p>
                    <span className="hidden md:block md:col-span-2 text-right eyebrow opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      Read →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-24 text-center border border-line">
            <p className="font-serif italic text-2xl text-mist">No policies have been published yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
