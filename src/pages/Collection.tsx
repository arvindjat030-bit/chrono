import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { BRANDS, CATEGORIES, MATERIALS, MOVEMENTS } from '../constants';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SAMPLE_WATCHES } from '../sampleData';
import { cn } from '../lib/utils';

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        if (data.length === 0) {
          setProducts(SAMPLE_WATCHES as Product[]);
        } else {
          setProducts(data);
        }
      } catch (error) {
        setProducts(SAMPLE_WATCHES as Product[]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'popularity') result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [products, searchQuery, selectedBrands, selectedCategories, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-[0.5em] text-xs mb-4 block">The Collection</span>
          <h1 className="text-5xl font-serif text-white mb-6">Masterpieces of Time</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our curated selection of high-end luxury watches from the world's most prestigious brands.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-y border-white/10 py-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white uppercase tracking-widest text-xs border border-white/20 px-6 py-3 hover:border-gold hover:text-gold transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white text-xs uppercase tracking-widest border-none focus:ring-0 cursor-pointer hover:text-gold"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Filters (Desktop) */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="hidden lg:block w-64 shrink-0 space-y-10"
              >
                <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 border-b border-gold/20 pb-2">Brands</h4>
                  <div className="space-y-3">
                    {BRANDS.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 bg-transparent border-white/20 rounded text-gold focus:ring-gold"
                        />
                        <span className="text-gray-400 text-sm group-hover:text-gold transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 border-b border-gold/20 pb-2">Category</h4>
                  <div className="space-y-3">
                    {CATEGORIES.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 bg-transparent border-white/20 rounded text-gold focus:ring-gold"
                        />
                        <span className="text-gray-400 text-sm group-hover:text-gold transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 border-b border-gold/20 pb-2">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-gold"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                      <span>$0</span>
                      <span>Up to ${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white/5">
                <p className="text-gray-500 uppercase tracking-widest text-sm">No timepieces found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setPriceRange([0, 200000]);
                    setSearchQuery('');
                  }}
                  className="mt-6 text-gold text-xs uppercase tracking-widest underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
