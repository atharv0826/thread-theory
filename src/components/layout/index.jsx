import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalHeader from './Header';
import { getFooterRes } from '../../helper/api';
import { onEntryChange } from '../../sdk/entry';

export default function Layout({ children }) {
  const CACHE_KEY = "global_footer_data";
  const [footer, setFooter] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  async function fetchFooter() {
    const data = await getFooterRes();
    if (data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setFooter(data);
    }
  }

  useEffect(() => {
    fetchFooter();
    onEntryChange(() => {
      fetchFooter();
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <GlobalHeader />

      <main className="flex-1 page-in">
        {children}
      </main>

      {footer ? (
        <footer className="bg-ink text-paper mt-32 overflow-hidden">
          <div className="mx-auto max-w-400 px-6 lg:px-12">
            {/* Giant masthead */}
            <div className="pt-20 pb-14 border-b border-paper/15">
              <h3
                className="font-serif tracking-tight leading-[0.95] text-[clamp(3rem,9vw,9rem)]"
                {...(footer.$?.title)}
              >
                {footer.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16">
              <div className="md:col-span-6">
                <p className="eyebrow text-paper/50! mb-6">The house</p>
                <p
                  className="font-serif italic text-xl md:text-2xl leading-relaxed text-paper/80 max-w-md"
                  {...(footer.$?.footer_text)}
                >
                  {footer.footer_text}
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="eyebrow text-paper/50! mb-6">Index</p>
                <ul className="space-y-4">
                  {footer.footer_links?.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.link?.href || '#'}
                        className="text-sm tracking-wide text-paper/80 hover:text-paper transition-colors"
                        {...(item.$?.label)}
                      >
                        <span className="link-sweep">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-3">
                <p className="eyebrow text-paper/50! mb-6">Elsewhere</p>
                <ul className="space-y-4">
                  {footer.social_links?.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.link?.href || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm tracking-wide text-paper/80 hover:text-paper transition-colors"
                        {...(item.$?.platform)}
                      >
                        <span className="link-sweep">{item.platform}</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-paper/15 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs tracking-[0.2em] uppercase text-paper/50" {...(footer.$?.copyright_text)}>
                {footer.copyright_text}
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="eyebrow text-paper/50! hover:text-paper! transition-colors cursor-pointer"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="bg-ink mt-32">
          <div className="mx-auto max-w-400 px-6 lg:px-12 py-20 animate-pulse space-y-12">
            <div className="h-24 w-2/3 bg-paper/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-3 w-20 bg-paper/10" />
                  <div className="h-3 w-32 bg-paper/10" />
                  <div className="h-3 w-28 bg-paper/10" />
                </div>
              ))}
            </div>
            <div className="h-3 w-64 bg-paper/10" />
          </div>
        </footer>
      )}
    </div>
  );
}
