import React from 'react';
import { Link } from 'react-router-dom';
import { Watch, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Watch className="w-8 h-8 text-gold" />
            <span className="text-2xl font-serif tracking-widest text-white uppercase">
              Chrono<span className="text-gold">Lux</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            The world's premier destination for luxury timepieces. 
            Curating excellence since 1995.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/collection" className="text-gray-400 hover:text-gold text-sm transition-colors">All Watches</Link></li>
            <li><Link to="/brands" className="text-gray-400 hover:text-gold text-sm transition-colors">Featured Brands</Link></li>
            <li><Link to="/limited" className="text-gray-400 hover:text-gold text-sm transition-colors">Limited Edition</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-gold text-sm transition-colors">Our Story</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            <li><Link to="/shipping" className="text-gray-400 hover:text-gold text-sm transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/warranty" className="text-gray-400 hover:text-gold text-sm transition-colors">Warranty Info</Link></li>
            <li><Link to="/auth" className="text-gray-400 hover:text-gold text-sm transition-colors">Authenticity Guarantee</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-gold text-sm transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white uppercase tracking-widest text-sm font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin className="w-5 h-5 text-gold shrink-0" />
              <span>123 Luxury Avenue, <br />Geneva, Switzerland</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <span>+41 22 123 4567</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <span>concierge@chronolux.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-gray-500 text-xs">
          © 2026 ChronoLux Luxury Timepieces. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          <span className="text-gray-500 text-xs hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-gray-500 text-xs hover:text-gold cursor-pointer transition-colors">Terms of Service</span>
          <span className="text-gray-500 text-xs hover:text-gold cursor-pointer transition-colors">Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}
