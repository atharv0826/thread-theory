import React, { useEffect, useState } from 'react';
import { getAboutPageRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getAboutPageRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching about page:", err);
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
           <p className="mt-4 text-sm font-medium text-stone-500 uppercase tracking-widest">Loading Storefront...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Failed to fetch about_page</pre></div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-8 text-center"
          {...(data.$?.page_title)}
        >
          {data.page_title}
        </h1>
          
        {data.image && (
          <div className="w-full aspect-video md:aspect-[21/9] bg-stone-100 rounded-2xl overflow-hidden relative mb-12 shadow-sm">
            <img 
              src={`${data.image.url}?format=webply&quality=85`}
              alt={data.image.title || "About Aurum Apparel"}
              className="w-full h-full object-cover"
              {...(data.image.$?.url)}
            />
          </div>
        )}
        
        {data.description && (
          <div 
            className="prose prose-stone prose-lg max-w-3xl mx-auto text-stone-700 leading-relaxed space-y-6"
            {...(data.$?.description)}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        )}

      </div>
    </Layout>
  );
}
