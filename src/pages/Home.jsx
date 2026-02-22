import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import RenderComponents from '../components/home/RenderComponents';
import { getHomePageRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getHomePageRes();
      setData(response);
    } catch (err) {
      console.error("Error fetching homepage:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Setup live preview listener
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
     return <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800">Failed to load Contentstack data.</div>;
  }

  return (
    <Layout>
       <RenderComponents components={data.page_sections} />
    </Layout>
  );
}
