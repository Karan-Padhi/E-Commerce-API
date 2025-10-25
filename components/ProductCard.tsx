
import React from 'react';
import { type Product } from '../types';
import { ICONS } from '../constants';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={product.images[0]} alt={product.name} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-100 truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            {product.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-indigo-400">${product.discountPrice.toFixed(2)}</p>
                <p className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-indigo-400">${product.price.toFixed(2)}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {ICONS.star}
            <span className="text-slate-300">{product.rating}</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-1">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      </div>
    </div>
  );
};

export default ProductCard;
