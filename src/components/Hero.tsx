import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Watch Background"
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold uppercase tracking-[0.5em] text-sm mb-4 block">
            Excellence in Timekeeping
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
            The Art of <br />
            <span className="italic text-gold">Luxury</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light tracking-wide">
            Discover our curated collection of the world's most prestigious timepieces. 
            Crafted for those who appreciate the finer things in life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/collection"
              className="group bg-gold text-black px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center gap-2"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/brands"
              className="text-white border border-white/30 px-10 py-4 text-sm uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
            >
              View Brands
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"></div>
      </motion.div>
    </section>
  );
}
