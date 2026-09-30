import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import RenderComponents from '../components/home/RenderComponents';
import { getHomePageRes } from '../helper/api';
import { useLivePreviewCtx } from '../context/live-preview-context-provider';
import { PageLoader, ErrorState } from '../components/ui';

export default function Home() {
  const lpTs = useLivePreviewCtx();
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
    fetchData();
  }, [lpTs]);

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
