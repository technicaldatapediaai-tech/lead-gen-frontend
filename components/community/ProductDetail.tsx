"use client";

import React, { useState } from 'react';
import { Product } from '@/lib/community/data';
import { useCart } from '@/context/community/CartContext';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="product-detail">
            <button onClick={onBack} className="btn-back">
                <i className="fas fa-chevron-left"></i> Back to Explorer
            </button>
            <div className="detail-header">
                <div className="header-info">
                    <div className="header-icon">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="header-text">
                        <h2 className="header-title">{product.name}</h2>
                        <span className="header-category">{product.category}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="header-pricing">
                        <span className="pricing-price">From ${product.price}</span>
                        <span className="pricing-info">Lifetime Access</span>
                    </div>
                    <button className="btn-get-now" onClick={() => addToCart(product)}>Get it Now</button>
                </div>
            </div>
            <nav className="detail-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >Overview</button>
                <button 
                  className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                  onClick={() => setActiveTab('features')}
                >Features</button>
                <button 
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >Reviews</button>
                <button 
                  className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
                  onClick={() => setActiveTab('plans')}
                >Plans</button>
            </nav>
            <div className="detail-content">
                {activeTab === 'overview' && (
                  <div className="content-overview">
                    <h3 className="section-title">Description</h3>
                    <p className="section-text">{product.description}</p>
                    <div className="overview-grid">
                      <div className="overview-item">
                        <h4>Best for</h4>
                        <p>{product.bestFor.join(', ')}</p>
                      </div>
                      <div className="overview-item">
                        <h4>Alternatives to</h4>
                        <p>{product.alternatives.join(', ')}</p>
                      </div>
                      <div className="overview-item">
                        <h4>Integrations</h4>
                        <p>{product.integrations.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div className="content-features">
                    {product.features.map((feature, i) => (
                      <div className="feature-item" key={i}>
                        <div className="feature-text">
                          <span className="feature-tag">{feature.tag}</span>
                          <h4>{feature.title}</h4>
                          <p>{feature.desc}</p>
                          <ul>
                            {feature.bullets.map((b, j) => <li key={j}>{b}</li>)}
                          </ul>
                        </div>
                        <div className="feature-image">
                          <img src={feature.image} alt={feature.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="content-reviews">
                    {product.reviews_data ? product.reviews_data.map((r, i) => (
                      <div className="review-card" key={i}>
                        <div className="review-author">
                          <img src={r.avatar} alt={r.author} />
                          <span>{r.author}</span>
                        </div>
                        <p className="review-text">"{r.text}"</p>
                      </div>
                    )) : <p>No reviews yet.</p>}
                  </div>
                )}
                {activeTab === 'plans' && (
                  <div className="content-plans">
                    <div className="plans-grid">
                      {product.tiers.map((t, i) => (
                        <div className={`plan-card ${t.popular ? 'popular' : ''}`} key={i}>
                          {t.popular && <span className="tier-badge">POPULAR</span>}
                          <h4 className="tier-name">{t.name}</h4>
                          <div className="tier-price">${t.price}</div>
                          <p className="tier-desc">{t.desc}</p>
                          <ul className="tier-features">
                            {t.features.map((f, j) => <li key={j}><i className="fas fa-check"></i> {f}</li>)}
                          </ul>
                          <button className="btn-tier-select" onClick={() => addToCart(product)}>Select Plan</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
