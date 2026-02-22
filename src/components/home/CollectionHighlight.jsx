import React from 'react';
import { Link } from 'react-router-dom';

export default function CollectionHighlight({ data }) {
  // Since we haven't fetched full product details yet, we'll mock the internal cards
  return (
    <section className="py-24 bg-stone-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" {...(data.$?.title)}>
          {data.title}
        </h2>
        {data.description && (
          <p className="max-w-2xl mx-auto text-stone-400 text-lg md:text-xl font-light mb-16" {...(data.$?.description)}>
            {data.description}
          </p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.products?.map((product, idx) => {
             // Handle referenced Product vs unresolved reference
             const isResolved = product.title || product.product_name;
             const productTitle = product.title || product.product_name || `Content Data (${product.uid?.substring(0,6)})`;
             const productPrice = product.price ? `$${product.price.toFixed(2)}` : "$--.--";
             // In the provided JSON, images are an array called product_images
             const imageUrl = product.product_images?.[0]?.url || null;

             const productUrl = product.url || `/#`;

             return (
               <Link to={productUrl} key={idx} className="group cursor-pointer block text-left">
                  <div className="aspect-[3/4] bg-stone-800 mb-6 overflow-hidden relative" {...(product.$?.product_images)}>
                     {imageUrl ? (
                        <img 
                          src={`${imageUrl}?format=webply&quality=85`} 
                          alt={productTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-500 font-medium text-center px-4">
                          {isResolved ? "No Image" : "Collection Item"}
                        </div>
                     )}
                     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="space-y-2 px-2">
                    <h3 className="text-base font-medium text-white group-hover:text-stone-300 transition-colors" {...(product.$?.title)}>
                      {productTitle}
                    </h3>
                    <p className="text-sm text-stone-400" {...(product.$?.price)}>{productPrice}</p>
                  </div>
               </Link>
             )
          })}
        </div>
      </div>
    </section>
  );
}
