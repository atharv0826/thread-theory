import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPolicyRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import Layout from '../components/layout';

export default function Policy() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const url = `/policies/${slug}`;
      const response = await getPolicyRes(url);
      setData(response);
    } catch (err) {
      console.error("Error fetching individual policy:", err);
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
       <div className="min-h-screen flex items-center justify-center bg-stone-50">
         <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-stone-500 uppercase tracking-widest">Loading Policy...</p>
         </div>
       </div>
     );
  }

  if (!data) {
     return <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-800 break-all"><pre>Policy not found: {slug}</pre></div>;
  }

  return (
    <Layout>
      <div className="bg-stone-50 min-h-screen pb-24">
        {/* Breadcrumbs */ }
        <div className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex text-sm text-stone-500 font-medium">
              <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/policies" className="hover:text-stone-900 transition-colors">Policies</Link>
              <span className="mx-2">/</span>
              <span className="text-stone-900 truncate" {...(data.$?.title)}>{data.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12 lg:p-16">
            <div className="mb-12 text-center">
              <h1 
                className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-6"
                {...(data.$?.title)}
              >
                {data.title}
              </h1>
              
              {(data.effective_date || data.summary) && (
                <div className="text-lg text-stone-600 font-light max-w-2xl mx-auto space-y-4">
                  {data.effective_date && (
                    <p className="text-sm font-bold uppercase tracking-widest text-stone-400">
                      Effective: {new Date(data.effective_date).toLocaleDateString()}
                    </p>
                  )}
                  {data.summary && (
                    <p {...(data.$?.summary)}>{data.summary}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-16">
              {data.body_sections?.map((block, idx) => {
                 // Render Anchor Links
                 if (block.anchor_link_section) {
                   return (
                     <div 
                       key={idx} 
                       id={block.anchor_link_section.anchor_id} 
                       className="scroll-mt-32"
                     />
                   );
                 }
                 
                 // Render Rich Text Sections
                 if (block.rich_text_section) {
                   return (
                     <div key={idx} className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed">
                       {block.rich_text_section.heading && (
                         <h2 
                           className="text-2xl md:text-3xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4"
                           {...(block.rich_text_section.$?.heading)}
                         >
                           {block.rich_text_section.heading}
                         </h2>
                       )}
                       
                       {/* The Utils.jsonToHTML modifies the object to include the raw HTML string if jsonRtePath is provided in API helper. If not, it falls back. */ }
                       {typeof block.rich_text_section.body === 'string' ? (
                         <div 
                           dangerouslySetInnerHTML={{ __html: block.rich_text_section.body }} 
                           {...(block.rich_text_section.$?.body)}
                         />
                       ) : (
                         <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm font-medium">
                           Rich Text Parsing Error: Ensure `jsonRtePath` is configured in the Contentstack `api.js` loader.
                         </div>
                       )}
                     </div>
                   );
                 }

                 return null;
              })}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
