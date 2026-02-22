import React from 'react';
import { Link } from 'react-router-dom';

export default function ImageText({ data }) {
  return (
    <section className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-square relative overflow-hidden rounded-sm">
            {data.image && (
              <img 
                src={`${data.image.url}?format=webply&quality=85`}
                alt={data.image.title || "Image"}
                className="w-full h-full object-cover"
                {...(data.image.$?.url)}
              />
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-start space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight" {...(data.$?.title)}>
              {data.title}
            </h2>
            
            {data.description && (
              <p className="text-lg text-stone-600 font-light leading-relaxed max-w-lg" {...(data.$?.description)}>
                {data.description}
              </p>
            )}

            {data.cta_label && data.cta_link && (
               <Link 
                 to={data.cta_link.href}
                 className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors mt-4"
                 {...(data.$?.cta_label)}
               >
                 {data.cta_label}
               </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
