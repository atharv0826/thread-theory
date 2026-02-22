import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout';
import { getCategoryRes, getProductsByCategory } from '../helper/api';
import { onEntryChange } from '../sdk/entry';

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
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-stone-600">The category you are looking for does not exist or has been removed.</p>
          <Link to="/collections" className="mt-8 px-6 py-3 bg-stone-900 text-white font-medium rounded-full hover:bg-stone-800 transition-colors">
            Back to Collections
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col w-full pb-20">
        
        {/* Dynamic Category Hero Banner */}
        <div className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-stone-100" {...(category.$?.image)}>
          {category.image?.url && (
            <img 
              src={`${category.image.url}?format=webply&quality=85`}
              alt={category.title || category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-stone-900/40"></div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md capitalize" {...(category.$?.title)}>
              {category.title || category.name}
            </h1>
            {category.description && (
              <p className="text-lg md:text-xl font-medium opacity-90 drop-shadow-sm max-w-2xl text-center" {...(category.$?.description)}>
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Mapped Iterative Product Layout Grid */}
        <div className="container mx-auto px-4 pt-16 max-w-7xl">
          
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-stone-900">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </h2>
          </div>

          {products.length === 0 ? (
             <div className="w-full py-16 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-100">
               No products currently available in this category.
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product, idx) => {
                const imageUrl = product.product_images?.[0]?.url;
                const price = product.price ? `$${(product.price).toFixed(2)}` : 'Pricing Unavailable';
                
                return (
                  <Link 
                    key={product.uid || idx} 
                    to={`/products/${product.slug}`} 
                    className="group flex flex-col"
                  >
                    <div className="w-full aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden relative mb-4">
                      {imageUrl ? (
                        <img 
                          src={`${imageUrl}?format=webply&quality=85`}
                          alt={product.product_name || product.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          {...(product.$?.product_images)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                          No Image
                        </div>
                      )}
                      
                      {/* Product Status Identifiers */}
                      {!product.in_stock && (
                        <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs px-3 py-1.5 font-bold uppercase tracking-wider rounded">
                           Out of Stock
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-stone-600 transition-colors" {...(product.$?.title)}>
                         {product.product_name || product.title}
                      </h3>
                      <p className="text-stone-500 mt-1 font-medium" {...(product.$?.price)}>
                         {price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
