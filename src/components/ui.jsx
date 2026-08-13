import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/** Scroll-triggered reveal. `effect`: up | fade | mask | line (styles in index.css). */
export function Reveal({ as = 'div', effect = 'up', delay = 0, className = '', children, ...rest }) {
  const Tag = as;
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      data-reveal={effect}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Per-word masked stagger for display headlines (animates on mount). */
export function SplitWords({ text, step = 80, delay = 0, italicLast = false, ...rest }) {
  const words = String(text || '').split(' ');
  return (
    <span {...rest}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="wm">
            <span
              className={`wm-i${italicLast && i === words.length - 1 ? ' italic' : ''}`}
              style={{ animationDelay: `${delay + i * step}ms` }}
            >
              {word}
            </span>
          </span>{' '}
        </React.Fragment>
      ))}
    </span>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 bg-paper">
      <span className="font-serif italic text-3xl tracking-tight">Thread Theory</span>
      <div className="loader-line" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}

export function ErrorState({ title, children }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="eyebrow mb-6">Nothing here</p>
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">{title}</h1>
      <div className="text-mist max-w-md leading-relaxed">{children}</div>
    </div>
  );
}

/** Editorial product card — shared by featured grids, category listings and related products. */
export function ProductCard({ product, index, dark = false, aspect = 'aspect-3/4' }) {
  const title = product.title || product.product_name || 'Untitled piece';
  const price = product.price != null ? `$${product.price.toFixed(2)}` : '$ —';
  const imageUrl = product.product_images?.[0]?.url;
  const url = product.url || (product.slug ? `/products/${product.slug}` : '#');

  return (
    <Link to={url} className="group block">
      <div
        className={`relative ${aspect} overflow-hidden mb-5 ${dark ? 'bg-white/5' : 'bg-cream'}`}
        {...(product.$?.product_images)}
      >
        {imageUrl ? (
          <img
            src={`${imageUrl}?format=webply&quality=85`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-serif italic ${dark ? 'text-paper/40' : 'text-mist'}`}>
            Image to come
          </div>
        )}

        {index != null && (
          <span
            className={`absolute top-4 left-4 text-[10px] tracking-[0.3em] font-medium ${
              dark ? 'text-paper/70' : 'text-ink/60'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {product.in_stock === false && (
          <span className="absolute top-4 right-4 bg-ink text-paper text-[10px] tracking-[0.25em] uppercase px-3 py-1.5">
            Sold out
          </span>
        )}

        <span
          className={`absolute inset-x-0 bottom-0 flex items-center justify-center py-3.5 text-[10px] tracking-[0.35em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
          }`}
        >
          View piece
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <h3
          className={`font-serif text-lg leading-snug ${dark ? 'text-paper' : 'text-ink'}`}
          {...(product.$?.title)}
        >
          <span className="link-sweep">{title}</span>
        </h3>
        <p className={`text-sm shrink-0 ${dark ? 'text-paper/60' : 'text-mist'}`} {...(product.$?.price)}>
          {price}
        </p>
      </div>
    </Link>
  );
}
