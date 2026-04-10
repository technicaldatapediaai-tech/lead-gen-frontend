"use client";

import React from 'react';
import { useCart } from '@/context/community/CartContext';
import { Product } from '@/lib/community/data';
import './ProductCard.css';


interface ProductCardProps {
    product: Product;
    onProductClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <div className="product-card" onClick={() => onProductClick(product.id)}>
            <div className="card-image-wrap">
                <img src={product.image} alt={product.name} />
                <span className="tag-select">APPSUMO | SELECT</span>
                {product.isNew && <span className="tag-new">New!</span>}
            </div>
            <div className="card-content">
                <div className="card-header-v2">
                    <div className="header-info-v2">
                        <span className="product-category-v2">IN {product.category.toUpperCase()}</span>
                        <h4 className="product-name-v2">{product.name}</h4>
                    </div>
                </div>
                <p className="product-desc">{product.description}</p>
                <div className="card-footer">
                    <div className="rating">
                        <i className="fas fa-star"></i>
                        <span>
                            {product.rating} <span className="reviews"> {product.reviews} reviews</span>
                        </span>
                    </div>
                    <div className="price-info">
                        <div className="price-wrap">
                            <span className="price">${product.price}</span>
                            <span className="price-type">/lifetime</span>
                        </div>
                        <span className="original-price">${product.originalPrice}</span>
                    </div>
                </div>
                <button className="btn-add-to-cart-large" onClick={handleAddToCart}>
                    ADD TO CART
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
