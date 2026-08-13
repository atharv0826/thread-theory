import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout';
import { getCategoryRes, getProductsByCategory } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import { Reveal, SplitWords, PageLoader, ErrorState, ProductCard } from '../components/ui';

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const categoryUrl = `/category/${slug}`;

      // 1. Fetch the category schema definition
      const categoryData = await getCategoryRes(categoryUrl);

      if (!categoryData) {
        setCategory(null);
        return;
      }

      setCategory(categoryData);

      // 2. Fetch products tagged dynamically to this category via its mapped UID
      const productsData = await getProductsByCategory(categoryData.uid);
      setProducts(productsData || []);

    } catch (err) {
      console.error("Error fetching category components:", err);
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
        <PageLoader label="Laying out the rail" />
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <ErrorState title="Category not found">
          <p className="mb-8">The category you are looking for does not exist or has been removed.</p>
          <Link to="/collections" className="btn-ink btn-solid">
            Back to collections
          </Link>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col w-full pb-8">
        {/* Cinematic category banner */}
        <div className="relative w-full min-h-[55svh] flex items-end overflow-hidden bg-ink text-paper" {...(category.$?.image)}>
          {category.image?.url && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={`${category.image.url}?format=webply&quality=85`}
                alt={category.title || category.name}
                className="w-full h-full object-cover opacity-60 animate-kenburns"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/30" />
            </div>
          )}

          <div className="relative z-10 w-full mx-auto max-w-400 px-6 lg:px-12 pb-16 pt-40">
            <p className="eyebrow text-paper/70! mb-6">The collection</p>
            <h1
              className="font-serif tracking-tight leading-[0.95] capitalize text-[clamp(3rem,8vw,7rem)]"
              {...(category.$?.title)}
            >
              <SplitWords text={category.title || category.name} delay={100} />
            </h1>
            {category.description && (
              <p
                className="font-serif italic text-lg md:text-xl text-paper/80 max-w-2xl mt-6"
                {...(category.$?.description)}
              >
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Product index */}
        <div className="mx-auto max-w-400 w-full px-6 lg:px-12 pt-20">
          <Reveal className="flex items-baseline justify-between border-b border-line pb-6 mb-16">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">The pieces</h2>
            <p className="eyebrow">
              {String(products.length).padStart(2, '0')} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          </Reveal>

          {products.length === 0 ? (
            <div className="w-full py-24 text-center border border-line">
              <p className="font-serif italic text-2xl text-mist">
                Nothing on the rail — for now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product, idx) => (
                <Reveal
                  key={product.uid || idx}
                  delay={(idx % 4) * 120}
                  className={idx % 2 === 1 ? 'lg:mt-16' : ''}
                >
                  <ProductCard product={product} index={idx} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
