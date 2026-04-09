"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/community/CartContext';

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const TAX_RATE = 0.08;
    const DELIVERY = cart.length > 0 ? 25 : 0;
    const DISCOUNT = promoApplied ? Math.round(cartTotal * 0.1 * 100) / 100 : 0;
    const tax = Math.round(cartTotal * TAX_RATE * 100) / 100;
    const total = Math.max(0, cartTotal + DELIVERY + tax - DISCOUNT);

    const handleApplyPromo = () => {
        if (promoCode.trim().toLowerCase() === 'save10') {
            setPromoApplied(true);
        } else {
            alert('Invalid promo code. Try SAVE10.');
        }
    };

    if (!isCartOpen) return null;

    return (
        <div className="cart-fullpage-overlay" tabIndex={-1} onClick={() => setIsCartOpen(false)}>
            <div className="cart-fullpage" onClick={(e) => e.stopPropagation()}>

                {/* Header Bar */}
                <div className="cfp-header-bar">
                    <div className="cfp-header">
                        <div>
                            <div className="cfp-nav-top">
                                <button className="cfp-back-link" onClick={() => setIsCartOpen(false)}>
                                    <i className="fas fa-arrow-left"></i> Continue Shopping
                                </button>
                                <div className="cfp-breadcrumbs">
                                    <span className="cfp-bc-item active">Cart</span>
                                    <i className="fas fa-chevron-right"></i>
                                    <span className="cfp-bc-item">Checkout</span>
                                    <i className="fas fa-chevron-right"></i>
                                    <span className="cfp-bc-item">Payment</span>
                                </div>
                            </div>
                            <h1 className="cfp-title">Your cart</h1>
                            <p className="cfp-subtitle">{cart.length} Product{cart.length !== 1 ? 's' : ''} in Your cart</p>
                        </div>
                        <button className="cfp-back-software-btn" onClick={() => setIsCartOpen(false)}>
                            <i className="fas fa-arrow-left"></i> Back to Software
                        </button>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="cfp-empty">
                        <div className="cfp-empty-canvas">
                            <div className="cfp-empty-icon-ring">
                                <i className="fas fa-shopping-bag"></i>
                            </div>
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven&apos;t added anything yet. Explore our premium software tools.</p>
                        <button className="cfp-btn-browse" onClick={() => setIsCartOpen(false)}>Start Shopping</button>
                    </div>
                ) : (
                    <div className="cfp-body">
                        {/* Left: Items */}
                        <div className="cfp-items-col">
                            <div className="cfp-items-list">
                                {cart.map((item) => (
                                    <div key={item.id} className="cfp-item">
                                        <div className="cfp-item-img">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cfp-item-info">
                                            <h4 className="cfp-item-name">{item.name}</h4>
                                            <p className="cfp-item-meta">Price: ${item.price.toFixed(2)} USD / per item</p>
                                        </div>
                                        <div className="cfp-item-actions">
                                            <div className="cfp-qty-wrap">
                                                <button className="cfp-qty-btn" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <span className="cfp-qty-value">{item.quantity}</span>
                                                <button className="cfp-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <button className="cfp-remove-btn" onClick={() => removeFromCart(item.id)} title="Remove">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="cfp-item-price">
                                            ${(item.price * item.quantity).toFixed(2)} USD
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="cfp-clear-btn" onClick={clearCart}>
                                Remove all from cart
                            </button>
                        </div>

                        {/* Right: Summary */}
                        <div className="cfp-summary-col">
                            <div className="cfp-promo-row">
                                <input
                                    className="cfp-promo-input"
                                    type="text"
                                    placeholder="Promocode"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button className="cfp-promo-btn" onClick={handleApplyPromo}>Apply</button>
                            </div>

                            <div className="cfp-breakdown">
                                <div className="cfp-breakdown-row">
                                    <span>{cart.length} item{cart.length !== 1 ? 's' : ''}:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="cfp-breakdown-row">
                                    <span>Delivery cost:</span>
                                    <span>${DELIVERY.toFixed(2)}</span>
                                </div>
                                <div className="cfp-breakdown-row">
                                    <span>Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                {DISCOUNT > 0 && (
                                    <div className="cfp-breakdown-row cfp-discount">
                                        <span>Discount:</span>
                                        <span>- ${DISCOUNT.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="cfp-total-row">
                                <span className="cfp-total-label">Total:</span>
                                <span className="cfp-total-value">${total.toFixed(2)}</span>
                            </div>

                            <button className="cfp-checkout-btn">
                                <i className="fas fa-lock"></i>
                                Secure Checkout →
                            </button>

                            <div className="cfp-trust-section">
                                <span className="cfp-trust-title">Guaranteed Safe Checkout</span>
                                <div className="cfp-trust-badges">
                                    <div className="cfp-badge-item" title="Secure SSL Encryption">
                                        <i className="fas fa-lock"></i>
                                        <span>SSL SECURE</span>
                                    </div>
                                    <div className="cfp-badge-item" title="Safe Payment">
                                        <i className="fas fa-shield-alt"></i>
                                        <span>SAFE PAY</span>
                                    </div>
                                </div>
                            </div>

                            <div className="cfp-help-section">
                                <span>Need help with your order?</span>
                                <a href="mailto:support@leadnius.com" className="cfp-help-link">Contact Support</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
