import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProductRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';
import { Reveal, PageLoader, ErrorState, ProductCard } from '../components/ui';

export default function Product() {
  const { pathname } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      // Execute the API query based purely on the exact route URL
      const response = await getProductRes(pathname);

      if (!response) {
        throw new Error('Product not found');
      }

      setData(response);
    } catch (err) {
      console.error("Error fetching product page:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    onEntryChange(() => {
      fetchData();
    });
  }, [pathname]);

  if (loading) {
    return (
      <Layout>
        <PageLoader label="Fitting the piece" />
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <ErrorState title="Piece not found">
          <p>We couldn't find the product you're looking for.</p>
        </ErrorState>
      </Layout>
    );
  }

  const title = data.title || data.product_name;
  const price = data.price != null ? `$${data.price.toFixed(2)}` : '$ —';
  const images = data.product_images || [];

  return (
    <Layout>
      <div className="mx-auto max-w-400 px-6 lg:px-12 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 eyebrow mb-12">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="text-line">/</span>
          <Link to="/collections" className="hover:text-ink transition-colors">Collections</Link>
          <span className="text-line">/</span>
          <span className="text-ink truncate max-w-40">{title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Stacked editorial gallery */}
          <div className="md:col-span-7 flex flex-col gap-6" {...(data.$?.product_images)}>
            {images.length > 0 ? (
              images.map((img, idx) => (
                <Reveal
                  key={idx}
                  effect="mask"
                  className={`overflow-hidden bg-cream ${idx === 0 ? 'aspect-4/5' : 'aspect-square'}`}
                >
                  <img
                    src={`${img.url}?format=webply&quality=85`}
                    alt={`${title} — view ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </Reveal>
              ))
            ) : (
              <div className="aspect-4/5 bg-cream flex items-center justify-center font-serif italic text-mist">
                Image to come
              </div>
            )}
          </div>

          {/* Sticky info column */}
          <div className="md:col-span-5 md:sticky md:top-32">
            <Reveal effect="line" className="w-16 h-px bg-ink mb-10" />

            <Reveal
              as="h1"
              delay={80}
              className="font-serif tracking-tight leading-[1.02] text-[clamp(2.5rem,4vw,4rem)] mb-6"
              {...(data.$?.title)}
            >
              {title}
            </Reveal>

            <Reveal as="p" delay={160} className="font-serif italic text-2xl text-ink-soft mb-10" {...(data.$?.price)}>
              {price}
            </Reveal>

            {data.description && (
              <Reveal delay={240} className="editorial-prose text-base! border-t border-line pt-8 mb-10" {...(data.$?.description)}>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
              </Reveal>
            )}

            {/* Mocked Add to Cart UI */}
            <Reveal delay={320} className="border-t border-line pt-8 space-y-8">
              <div>
                <p className="eyebrow mb-4">Size</p>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={`w-12 h-12 flex items-center justify-center border text-sm font-medium transition-all duration-300 cursor-pointer ${
                        size === s
                          ? 'bg-ink text-paper border-ink'
                          : 'border-line hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-ink btn-solid w-full">
                Add to cart {size ? `— ${size}` : ''}
              </button>

              <p className="eyebrow text-center">Free shipping on orders over $150</p>
            </Reveal>
          </div>
        </div>

        {/* Related pieces */}
        {data.related_products && data.related_products.length > 0 && (
          <section className="mt-32">
            <Reveal className="flex items-baseline justify-between border-b border-line pb-6 mb-16">
              <h2 className="font-serif tracking-tight text-3xl md:text-4xl">You may also like</h2>
              <p className="eyebrow">{String(data.related_products.length).padStart(2, '0')} pieces</p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {data.related_products.map((product, idx) => (
                <Reveal key={product.uid || idx} delay={(idx % 4) * 120}>
                  <ProductCard product={product} index={idx} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
