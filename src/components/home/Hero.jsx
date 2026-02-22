import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ data }) {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-stone-900 text-white">
      {data.background_image && (
         <div className="absolute inset-0 z-0">
           <img 
             src={`${data.background_image.url}?format=webply&quality=85`}
             alt={data.background_image.title || "Hero background"} 
             className="w-full h-full object-cover opacity-60 mix-blend-multiply"
             {...(data.background_image.$?.url)}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40"></div>
         </div>
      )}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" {...(data.$?.heading)}>
          {data.heading}
        </h1>
        {data.subheading && (
          <p className="text-xl md:text-2xl text-stone-200 mb-10 max-w-2xl font-light" {...(data.$?.subheading)}>
            {data.subheading}
          </p>
        )}
        {data.cta_label && data.cta_link && (
          <Link 
            to={data.cta_link.href}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-900 text-sm font-bold uppercase tracking-widest hover:bg-stone-100 transition-colors"
            {...(data.$?.cta_label)}
          >
            {data.cta_label}
          </Link>
        )}
      </div>
    </section>
  );
}
