import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout';
import { getCollectionsRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';

export default function Collections() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await getCollectionsRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching collections page:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    onEntryChange(() => {
      fetchData();
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Content Not Accessible</h1>
          <p className="text-stone-600">Failed to load the curated collections from Contentstack.</p>
        </div>
      </Layout>
    );
  }

  const { heading, subheading, background_image, reference } = data;

  return (
    <Layout>
      <div className="flex flex-col w-full">
        {/* Dynamic Hero Banner */}
        <div className="relative w-full h-[45vh] min-h-[400px] flex items-center justify-center overflow-hidden" {...(data.$?.background_image)}>
          {background_image?.url && (
            <img 
              src={`${background_image.url}?format=webply&quality=85`} 
              alt={background_image.title || "Collections Banner"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-stone-900/40"></div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md" {...(data.$?.heading)}>
              {heading}
            </h1>
            <p className="text-lg md:text-xl font-medium opacity-90 drop-shadow-sm max-w-xl text-center" {...(data.$?.subheading)}>
              {subheading}
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {reference?.map((category, idx) => {
              const catTitle = category.title || category.name;
              const catImage = category.image?.url;
              const catDesc = category.description;
              // Assuming 'url' field contains something like '/category/tshirts'
              // You can update the mapping depending on your routing desires. For now we use the strict slug identifier or url field itself if available.
              const linkDest = category.url || `/collections/${category.slug}`;

              return (
                <Link 
                  to={linkDest} 
                  key={idx} 
                  className="group relative flex flex-col bg-white overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative shadow-sm" {...(category.$?.image)}>
                     {catImage ? (
                        <img 
                          src={`${catImage}?format=webply&quality=85`} 
                          alt={catTitle}
                          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                           No Image
                        </div>
                     )}
                     {/* Hover Overlay */}
                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="pt-6 flex flex-col">
                    <h3 className="text-2xl font-bold text-stone-900 mb-2 truncate" {...(category.$?.title)}>
                      {catTitle}
                    </h3>
                    <div className="w-12 h-0.5 bg-stone-900 mb-4 transition-all duration-300 group-hover:w-20"></div>
                    {catDesc && (
                      <p className="text-stone-600 line-clamp-2" {...(category.$?.description)}>
                        {catDesc}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </Layout>
  );
}
