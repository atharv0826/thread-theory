import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import RenderComponents from '../components/home/RenderComponents';
import { getHomePageRes } from '../helper/api';
import { onEntryChange } from '../sdk/entry';
import { PageLoader, ErrorState } from '../components/ui';

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
      <Layout loading>
        <PageLoader label="Opening the issue" />
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <ErrorState title="The page is blank">
          <p>We couldn't load the storefront from Contentstack. Please try again shortly.</p>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <RenderComponents components={data.page_sections} />
    </Layout>
  );
}
