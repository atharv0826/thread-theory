import React from 'react';
import HeroSection from './Hero';
import FeaturedProducts from './FeaturedProducts';
import ImageText from './ImageText';
import CollectionHighlight from './CollectionHighlight';

export default function RenderComponents({ components }) {
  return (
    <div className="flex flex-col w-full">
      {components?.map((component, idx) => {
        if (component.hero_section) {
          return <HeroSection key={`hero-${idx}`} data={component.hero_section} />;
        }
        if (component.featured_products) {
          return <FeaturedProducts key={`featured-${idx}`} data={component.featured_products} />;
        }
        if (component.image_text) {
          return <ImageText key={`imagetext-${idx}`} data={component.image_text} />;
        }
        if (component.collection_highlight) {
          return <CollectionHighlight key={`collection-${idx}`} data={component.collection_highlight} />;
        }
        return <div key={`unknown-${idx}`} className="p-4 bg-red-100 text-red-800">Unknown component block type.</div>;
      })}
    </div>
  );
}
