import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProductRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';

export default function Product() {
  const { pathname } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-stone-600">We couldn't find the product you're looking for.</p>
        </div>
      </Layout>
    );
  }

  const title = data.title || data.product_name;
  const price = data.price ? `$${data.price.toFixed(2)}` : "$--.--";
  const imageUrl = data.product_images?.[0]?.url;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] bg-stone-100 rounded-xl overflow-hidden relative shadow-sm" {...(data.$?.product_images)}>
              {imageUrl ? (
                <img 
                  src={`${imageUrl}?format=webply&quality=85`}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  No Image Available
                </div>
              )}
            </div>
            {/* Thumbnail strip mockup, taking images from product_images if available */}
            {data.product_images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {data.product_images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-stone-100 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={`${img.url}?format=webply&quality=85`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            <nav className="text-sm text-stone-500 mb-6 flex gap-2">
              <span>Home</span>
              <span>/</span>
              <span>Products</span>
              <span>/</span>
              <span className="text-stone-900 font-medium truncate">{title}</span>
            </nav>

            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 mb-4" {...(data.$?.title)}>
              {title}
            </h1>
            
            <p className="text-2xl text-stone-700 mb-8 font-medium" {...(data.$?.price)}>
              {price}
            </p>

            <div className="prose prose-stone text-stone-600 mb-10 leading-relaxed" {...(data.$?.description)}>
              {data.description && <div dangerouslySetInnerHTML={{ __html: data.description }} />}
            </div>

            {/* Mocked Add to Cart UI */}
            <div className="space-y-6 pt-8 border-t border-stone-200">
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-3">Size</h3>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="w-12 h-12 flex items-center justify-center border border-stone-200 rounded-md hover:border-stone-900 transition-colors font-medium">
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-stone-900 text-white py-4 rounded-md font-medium hover:bg-stone-800 transition-colors cursor-pointer">
                Add to Cart
              </button>
              
              <p className="text-xs text-stone-500 text-center uppercase tracking-wide">
                Free shipping on orders over $150
              </p>
            </div>
            
          </div>

        </div>

        {/* You May Also Like Section */}
        {data.related_products && data.related_products.length > 0 && (
          <div className="mt-24 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-10 tracking-tight text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.related_products.map((product, idx) => (
                <Link key={idx} to={product.url || `/products/${product.slug}`} className="group block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 h-full flex flex-col transform group-hover:-translate-y-1">
                    <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden">
                      {product.product_images?.[0]?.url ? (
                        <img 
                          src={`${product.product_images[0].url}?format=webply&quality=85`} 
                          alt={product.title || product.product_name || 'Related Product'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-stone-600 transition-colors line-clamp-2">
                        {product.title || product.product_name}
                      </h3>
                      <p className="text-stone-500 font-medium mt-auto">
                        {product.price ? `$${product.price.toFixed(2)}` : 'Pricing Unavailable'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
