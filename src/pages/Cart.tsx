import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 bg-black min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-gray-600" />
        </div>
        <h1 className="text-4xl font-serif text-white mb-4">Your collection is empty</h1>
        <p className="text-gray-400 mb-10 max-w-sm">
          It seems you haven't added any timepieces to your collection yet.
        </p>
        <Link
          to="/collection"
          className="bg-gold text-black px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-white transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-12">Shopping Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white/5 border border-white/10"
              >
                <div className="w-full sm:w-32 aspect-square bg-gray-900 shrink-0">
                  <img
                    src={item.product?.images[0]}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-gold uppercase tracking-widest text-[10px] block mb-1">{item.product?.brand}</span>
                        <h3 className="text-xl font-serif text-white">{item.product?.name}</h3>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.productId);
                          toast.error('Item removed from collection');
                        }}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1 mb-4">{item.product?.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-white/20">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm text-white font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white font-mono text-lg">
                      {formatPrice((item.product?.price || 0) * item.quantity, item.product?.currency)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-8 sticky top-32">
              <h2 className="text-xl font-serif text-white mb-8 border-b border-gold/20 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Insured Shipping</span>
                  <span className="text-green-500 uppercase text-[10px] font-bold tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax (Estimated)</span>
                  <span className="text-white font-mono">{formatPrice(cartTotal * 0.08)}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-white uppercase tracking-widest text-xs font-bold">Total Investment</span>
                  <span className="text-3xl text-gold font-mono tracking-tighter">{formatPrice(cartTotal * 1.08)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gold text-black py-5 uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-3 hover:bg-white transition-all mb-6"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-3 text-gray-500 text-[10px] uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gold" />
                Secure Checkout Powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
