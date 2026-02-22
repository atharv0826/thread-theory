import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHeaderRes } from '../../helper/api';
import { onEntryChange } from '../../sdk/entry';

export default function GlobalHeader() {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await getHeaderRes();
      setHeader(response);
    } catch (err) {
      console.error("Error fetching global header:", err);
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
    return <header className="h-16 w-full bg-white/80 backdrop-blur-md border-b border-stone-200" />;
  }

  if (!header) {
    return <header className="h-16 w-full bg-red-50 text-red-800 flex items-center px-4">Failed to load Header</header>;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {header.logo && (
            <img 
              src={`${header.logo.url}?format=webply&quality=85`} 
              alt={header.logo.title || "Logo"} 
              className="h-8 w-auto" 
              {...(header.logo.$?.url)}
            />
          )}
          <span className="font-bold text-xl tracking-tight" {...(header.$?.title)}>{header.title}</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {header.navigation_links?.map((navItem, idx) => (
            <Link 
              key={idx} 
              to={navItem.link?.href || '#'} 
              className="hover:text-stone-500 transition-colors"
              {...(navItem.$?.label)}
            >
              {navItem.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           {header.cta?.label && (
             <Link 
               to={header.cta.link?.href || '#'} 
               className="hidden md:block text-sm font-medium px-4 py-2 border border-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-colors"
               {...(header.cta.$?.label)}
             >
               {header.cta.label}
             </Link>
           )}
        </div>
      </div>
    </header>
  );
}
