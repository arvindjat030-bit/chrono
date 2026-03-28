import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Heart, Package, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Product } from '../types';
import { SAMPLE_WATCHES } from '../sampleData';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../lib/utils';

export default function Profile() {
  const { user, userProfile, logout, isAdmin } = useAuth();
  const { wishlist } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'products'), where('__name__', 'in', wishlist.slice(0, 10)));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setWishlistProducts(data);
      } catch (error) {
        // Fallback to sample data for demo if wishlist contains sample IDs
        const samples = SAMPLE_WATCHES.filter(p => wishlist.includes(p.id!)) as Product[];
        setWishlistProducts(samples);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [wishlist]);

  if (!user) {
    return (
      <div className="pt-40 pb-20 px-6 bg-black min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Please Login</h1>
        <p className="text-gray-400 mb-10">You need to be authenticated to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-8 text-center sticky top-32">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-2 border-gold p-1">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-xl font-serif text-white mb-1">{user.displayName}</h2>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{userProfile?.role || 'Customer'}</p>
              
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3 text-gray-400 text-sm py-2 border-b border-white/5">
                  <Mail className="w-4 h-4 text-gold" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm py-2 border-b border-white/5">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>Joined March 2026</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm py-2">
                  <Shield className="w-4 h-4 text-gold" />
                  <span>Verified Account</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-500 text-xs uppercase tracking-widest font-bold border border-red-500/20 py-3 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Total Orders</p>
                  <p className="text-xl text-white font-serif">0 Orders</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Wishlist</p>
                  <p className="text-xl text-white font-serif">{wishlist.length} Items</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Account Status</p>
                  <p className="text-xl text-white font-serif">Active</p>
                </div>
              </div>
            </div>

            {/* Wishlist */}
            <div>
              <h3 className="text-2xl font-serif text-white mb-8 border-b border-gold/20 pb-4">My Wishlist</h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 border border-white/5">
                  <p className="text-gray-500 uppercase tracking-widest text-sm">Your wishlist is empty.</p>
                  <Link to="/collection" className="mt-4 text-gold text-xs uppercase tracking-widest underline underline-offset-4 inline-block">Start Exploring</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {wishlistProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-2xl font-serif text-white mb-8 border-b border-gold/20 pb-4">Recent Orders</h3>
              <div className="text-center py-20 border border-white/5">
                <p className="text-gray-500 uppercase tracking-widest text-sm">No orders found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
