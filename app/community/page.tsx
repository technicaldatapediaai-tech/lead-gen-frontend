"use client";

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/community/Navbar';
import Sidebar from '@/components/community/Sidebar';
import ProductGrid from '@/components/community/ProductGrid';
import ProductDetail from '@/components/community/ProductDetail';
import BottomSection from '@/components/community/BottomSection';
import Footer from '@/components/community/Footer';
import SignupPage from '@/components/community/SignupPage';
import RegistrationsView from '@/components/community/RegistrationsView';
import Cart from '@/components/community/Cart';
import { products } from '@/lib/community/data';
import { CartProvider } from '@/context/community/CartContext';
import { useSearchParams } from 'next/navigation';
import { SaasModal } from '@/components/SaasModal';
import { useAuth } from '@/contexts/AuthContext';
import './community.css';

// Font Awesome is used by community components for icons
const FontAwesomeLink = () => (
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
  />
);

function CommunityContent() {
  const searchParams = useSearchParams();
  const signupParam = searchParams.get('signup');
  const emailParam = searchParams.get('email');
  const showModalParam = searchParams.get('showModal');

  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('shop');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [showSignup, setShowSignup] = useState(signupParam === 'true');
  const [isSaasModalOpen, setIsSaasModalOpen] = useState(false);

  useEffect(() => {
    if (showModalParam === 'true' && !isAuthenticated) {
      // Small delay to ensure the page has loaded visually
      const timer = setTimeout(() => {
        setIsSaasModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showModalParam, isAuthenticated]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;


  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'shop' ||
      product.category.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <CartProvider>
      <FontAwesomeLink />
      <div className="community-root">
        {isSaasModalOpen ? (
          <header className="community-navbar">
            <div className="navbar-container">
              <div className="navbar-left">
                <div className="logo-wrap">
                  <span className="logo-text-primary">Leadnius</span>
                  <span className="logo-text-secondary">Community</span>
                </div>
              </div>
            </div>
          </header>
        ) : (
          <Navbar 
            onSearch={setSearchQuery} 
            onRegisterClick={() => setShowSignup(true)} 
            onSoftwareClick={() => {
              setSelectedProductId(null);
              setShowSignup(false);
              setShowRegistrations(false);
            }}
            isDetailView={!!selectedProductId}
          />
        )}
        
        <div className="app-container">
          {showRegistrations ? (
            <RegistrationsView onBack={() => setShowRegistrations(false)} />
          ) : showSignup ? (
            <SignupPage onBack={() => setShowSignup(false)} initialEmail={emailParam || undefined} />
          ) : (
            <>
              {!selectedProduct && !isSaasModalOpen && (
                <Sidebar 
                  currentCategory={activeCategory} 
                  onCategoryChange={(cat: string) => {
                    setActiveCategory(cat);
                    setSelectedProductId(null);
                  }} 
                />
              )}
              
              {!isSaasModalOpen && (
                <main className={`main-content ${selectedProduct ? 'full-width' : ''}`}>
                  <div className={`content-body ${selectedProduct ? 'content-body-detail' : ''}`}>
                    {selectedProduct ? (
                      <ProductDetail 
                        product={selectedProduct} 
                        onBack={() => setSelectedProductId(null)} 
                      />
                    ) : (
                      <>
                        <div className="hero">
                          <div className="hero-header">
                            <div className="hero-left">
                              <h2 className="hero-title-main">Browse software</h2>
                              <p className="product-count">{filteredProducts.length} products</p>
                            </div>
                            <div className="hero-right">
                              <span className="sort-label">Sort by:</span>
                              <div className="sort-select-wrapper">
                                <select className="sort-select" defaultValue="recommended">
                                  <option value="recommended">Recommended</option>
                                  <option value="latest">Latest</option>
                                  <option value="reviews"># customer reviews</option>
                                  <option value="rating">Avg customer rating</option>
                                  <option value="price-low">Price: low to high</option>
                                  <option value="price-high">Price: high to low</option>
                                </select>
                                <span className="sort-icon">
                                  <i className="fas fa-chevron-down"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ProductGrid 
                          products={filteredProducts} 
                          onProductClick={setSelectedProductId} 
                        />
                        <BottomSection onRegisterClick={() => setShowSignup(true)} />
                      </>
                    )}
                  </div>
                </main>
              )}
            </>
          )}
        </div>
        
        <Cart />
        <SaasModal isOpen={isSaasModalOpen} onClose={() => setIsSaasModalOpen(false)} />
      </div>
    </CartProvider>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium animate-pulse">Loading Community...</p>
        </div>
      </div>
    }>
      <CommunityContent />
    </Suspense>
  );
}
