"use client";

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/community/data';

interface ProductGridProps {
  products: Product[];
  onProductClick: (id: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
      ))}
    </section>
  );
};

export default ProductGrid;
