import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getHeaderRes } from '../../helper/api';
import { onEntryChange } from '../../sdk/entry';

export default function GlobalHeader() {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  async function fetchData() {
    try {
      const response = await getHeaderRes();
      setHeader(response);
    } catch (err) {
      console.error("Error fetching global header:", err);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (loading) {
    return <header className="h-20 w-full bg-paper/90 backdrop-blur-md border-b border-line" />;
  }

  if (!header) {
    return (
      <header className="h-20 w-full flex items-center justify-center border-b border-line">
        <span className="eyebrow text-accent">Header unavailable</span>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-400 px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Masthead */}
        <Link to="/" className="flex items-center gap-3 group">
          {header.logo && (
            <img
              src={`${header.logo.url}?format=webply&quality=85`}
              alt={header.logo.title || 'Logo'}
              className="h-7 w-auto transition-transform duration-500 group-hover:rotate-[8deg]"
              {...(header.logo.$?.url)}
            />
          )}
          <span className="font-serif text-2xl tracking-tight" {...(header.$?.title)}>
            {header.title}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {header.navigation_links?.map((navItem, idx) => {
            const active = navItem.link?.href === pathname;
            return (
              <Link
                key={idx}
                to={navItem.link?.href || '#'}
                className={`text-[11px] font-medium uppercase tracking-[0.25em] transition-colors ${
                  active ? 'text-ink' : 'text-mist hover:text-ink'
                }`}
                {...(navItem.$?.label)}
              >
                <span className="link-sweep">{navItem.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          {header.cta?.label && (
            <Link
              to={header.cta.link?.href || '#'}
              className="btn-ink hidden md:inline-flex px-7! py-3!"
              {...(header.cta.$?.label)}
            >
              {header.cta.label}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block h-px w-6 bg-ink transition-transform duration-300 ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-ink transition-transform duration-300 ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-20 z-40 bg-paper flex flex-col transition-opacity duration-500 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {header.navigation_links?.map((navItem, idx) => (
            <Link
              key={idx}
              to={navItem.link?.href || '#'}
              className="group flex items-baseline gap-4 py-3 border-b border-line"
              style={{
                transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: `${idx * 70}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'none' : 'translateY(24px)',
              }}
              {...(navItem.$?.label)}
            >
              <span className="text-[10px] tracking-[0.3em] text-mist">{String(idx + 1).padStart(2, '0')}</span>
              <span className="font-serif text-4xl tracking-tight group-hover:italic transition-all">{navItem.label}</span>
            </Link>
          ))}
        </nav>
        {header.cta?.label && (
          <div className="p-8">
            <Link to={header.cta.link?.href || '#'} className="btn-ink btn-solid w-full" {...(header.cta.$?.label)}>
              {header.cta.label}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
