import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { SAMPLE_WATCHES } from '../sampleData';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'products'), where('isFeatured', '==', true), limit(4));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (products.length === 0) {
          // Fallback to sample data for demo
          setFeaturedProducts(SAMPLE_WATCHES.slice(0, 4) as Product[]);
        } else {
          setFeaturedProducts(products);
        }
      } catch (error) {
        // If collection doesn't exist yet, use sample data
        setFeaturedProducts(SAMPLE_WATCHES.slice(0, 4) as Product[]);
        console.warn('Using sample data as Firestore is empty or inaccessible');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const features = [
    { icon: <ShieldCheck className="w-8 h-8 text-gold" />, title: 'Authenticity Guaranteed', desc: 'Every timepiece is verified by our master horologists.' },
    { icon: <Truck className="w-8 h-8 text-gold" />, title: 'Insured Shipping', desc: 'Complimentary worldwide shipping with full insurance.' },
    { icon: <RotateCcw className="w-8 h-8 text-gold" />, title: 'Lifetime Warranty', desc: 'Extended protection for your investment.' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Hero />

      {/* Featured Collection */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-xs mb-4 block">Curated Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Featured Timepieces</h2>
          </div>
          <Link to="/collection" className="text-gold uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all">
            View All Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-gold uppercase tracking-[0.3em] text-xs mb-12 block">Prestigious Partners</span>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-serif text-white tracking-widest">ROLEX</span>
            <span className="text-2xl font-serif text-white tracking-widest">OMEGA</span>
            <span className="text-2xl font-serif text-white tracking-widest">PATEK PHILIPPE</span>
            <span className="text-2xl font-serif text-white tracking-widest">TAG HEUER</span>
            <span className="text-2xl font-serif text-white tracking-widest">CARTIER</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-8 border border-white/5 hover:border-gold/20 transition-all"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-serif text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gold p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif text-black mb-6">Join the Inner Circle</h2>
            <p className="text-black/70 mb-10 max-w-xl mx-auto">
              Subscribe to receive exclusive previews of new arrivals, 
              limited edition releases, and horological insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 bg-black/10 border border-black/20 px-6 py-4 text-black placeholder:text-black/40 focus:outline-none focus:border-black"
              />
              <button className="bg-black text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
