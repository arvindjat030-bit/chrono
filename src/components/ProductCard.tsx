import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-black border border-white/10 hover:border-gold/30 transition-all duration-500 overflow-hidden"
    >
      {/* Badge */}
      {product.isFeatured && (
        <div className="absolute top-4 left-4 z-10 bg-gold text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
          Featured
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={cn(
              "p-3 rounded-full transition-all hover:scale-110",
              isWishlisted ? "bg-gold text-black" : "bg-white/10 text-white backdrop-blur-md hover:bg-gold hover:text-black"
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>
          
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-gold hover:text-black transition-all hover:scale-110"
          >
            <Eye className="w-5 h-5" />
          </Link>
          
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-gold hover:text-black transition-all hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 block">
          {product.brand}
        </span>
        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(product.rating) ? "text-gold fill-current" : "text-gray-600"
              )}
            />
          ))}
          <span className="text-[10px] text-gray-500 ml-1">({product.reviewsCount})</span>
        </div>
        
        <p className="text-white font-mono text-xl tracking-tighter">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>

      {/* Quick Buy Button (Mobile only or hover) */}
      <button
        onClick={() => addToCart(product)}
        className="w-full py-4 bg-white/5 border-t border-white/10 text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gold hover:text-black hover:font-bold transition-all"
      >
        Quick Add to Cart
      </button>
    </motion.div>
  );
}
