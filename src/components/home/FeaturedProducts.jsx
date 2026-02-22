import React from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedProducts({ data }) {
  // Since we haven't fetched full product details yet, we'll mock the internal cards
  // based on the uids we have from the response.
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-10 text-center" {...(data.$?.title)}>
          {data.title}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.products?.map((product, idx) => {
             // Handle referenced Product vs unresolved reference
             const isResolved = product.title || product.product_name;
             const productTitle = product.title || product.product_name || `Product Component (${product.uid?.substring(0,6)})`;
             const productPrice = product.price ? `$${product.price.toFixed(2)}` : "$--.--";
             // In the provided JSON, images are an array called product_images
             const imageUrl = product.product_images?.[0]?.url || null;

             const productUrl = product.url || `/#`;

             return (
               <Link to={productUrl} key={idx} className="group cursor-pointer block">
                  <div className="aspect-[4/5] bg-stone-100 mb-4 overflow-hidden rounded-md relative" {...(product.$?.product_images)}>
                     {imageUrl ? (
                       <img 
                         src={`${imageUrl}?format=webply&quality=85`} 
                         alt={productTitle} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-stone-400 font-medium text-center px-4">
                         {isResolved ? "No Image" : "Product Component"}
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-stone-900 group-hover:underline underline-offset-4" {...(product.$?.title)}>
                      {productTitle}
                    </h3>
                    <p className="text-sm text-stone-500" {...(product.$?.price)}>{productPrice}</p>
                  </div>
               </Link>
             );
          })}
        </div>
      </div>
    </section>
  );
}
