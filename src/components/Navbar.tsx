import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, X, Search, Watch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user, signIn, logout, isAdmin } = useAuth();
  const { cart, wishlist } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'Brands', path: '/brands' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-black/80 backdrop-blur-md border-b border-gold/20" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Watch className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-serif tracking-widest text-white uppercase">
            Chrono<span className="text-gold">Lux</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-widest transition-colors hover:text-gold",
                location.pathname === link.path ? "text-gold" : "text-gray-300"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="text-gray-300 hover:text-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <Link to="/wishlist" className="relative text-gray-300 hover:text-gold transition-colors">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-gray-300 hover:text-gold transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-gray-300 hover:text-gold transition-colors">
                <User className="w-5 h-5" />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-xs text-gold border border-gold/50 px-2 py-1 rounded hover:bg-gold hover:text-black transition-all">
                  ADMIN
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={signIn}
              className="text-sm uppercase tracking-widest text-gold border border-gold/50 px-4 py-2 hover:bg-gold hover:text-black transition-all"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-gold/20 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg uppercase tracking-widest text-gray-300 hover:text-gold"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
