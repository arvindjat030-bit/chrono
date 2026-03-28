import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SAMPLE_WATCHES } from '../sampleData';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart, toggleWishlist, wishlist } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() } as Product);
        } else {
          // Fallback to sample data
          const sample = SAMPLE_WATCHES.find(p => p.id === id) || SAMPLE_WATCHES[0];
          setProduct(sample as Product);
        }
      } catch (error) {
        const sample = SAMPLE_WATCHES.find(p => p.id === id) || SAMPLE_WATCHES[0];
        setProduct(sample as Product);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Product not found</div>;

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 mb-12">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/collection" className="hover:text-gold transition-colors">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] bg-gray-900 overflow-hidden border border-white/10"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square bg-gray-900 border transition-all",
                    activeImage === idx ? "border-gold" : "border-white/10 hover:border-gold/50"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-gold uppercase tracking-[0.4em] text-xs mb-4 block">{product.brand}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating) ? "text-gold fill-current" : "text-gray-600"
                    )}
                  />
                ))}
                <span className="text-sm text-gray-400 ml-2">{product.rating} ({product.reviewsCount} reviews)</span>
              </div>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-sm text-green-500 uppercase tracking-widest font-bold">In Stock</span>
            </div>

            <p className="text-3xl text-white font-mono mb-8 tracking-tighter">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="text-gray-400 leading-relaxed mb-10 text-lg font-light">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gold text-black py-5 uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-3 hover:bg-white transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "px-8 py-5 border transition-all flex items-center justify-center gap-3",
                  isWishlisted ? "bg-white/10 border-gold text-gold" : "border-white/20 text-white hover:border-gold hover:text-gold"
                )}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="border-t border-white/10 pt-10 mb-12">
              <h3 className="text-white uppercase tracking-widest text-xs font-bold mb-8">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/10">
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Authentic</span>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Insured</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gold mx-auto mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
