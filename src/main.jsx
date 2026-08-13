import React, { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LivePreviewProvider } from './context/live-preview-context-provider'
import Home from './pages/Home'
import About from './pages/About'
import Product from './pages/Product'
import Collections from './pages/Collections'
import Category from './pages/Category'
import Policies from './pages/Policies'
import Policy from './pages/Policy'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    // 'instant' bypasses the global smooth scroll-behavior
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <LivePreviewProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/policies/:slug" element={<Policy />} />
        </Routes>
      </LivePreviewProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
