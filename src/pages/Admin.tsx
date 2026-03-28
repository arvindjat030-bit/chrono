import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Package, Users, BarChart3, Search, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { BRANDS, CATEGORIES } from '../constants';
import { SAMPLE_WATCHES } from '../sampleData';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: BRANDS[0],
    price: 0,
    currency: 'USD',
    category: CATEGORIES[0],
    description: '',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '40mm',
      movement: 'Automatic',
      powerReserve: '40 hours',
      waterResistance: '100m',
      material: 'Steel',
      strap: 'Bracelet'
    },
    stock: 10,
    rating: 5,
    reviewsCount: 0,
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
      toast.success('Product added successfully');
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this timepiece?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const seedSampleData = async () => {
    if (!window.confirm('This will add 5 sample luxury watches to your collection. Continue?')) return;
    setIsSubmitting(true);
    try {
      for (const watch of SAMPLE_WATCHES) {
        await addDoc(collection(db, 'products'), {
          ...watch,
          createdAt: serverTimestamp()
        });
      }
      toast.success('Sample data seeded successfully');
      fetchProducts();
    } catch (error) {
      console.error('Seeding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-40 pb-20 px-6 bg-black min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-10">You do not have administrative privileges to access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-xs mb-2 block">Management Dashboard</span>
            <h1 className="text-4xl font-serif text-white">Admin Control Center</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={seedSampleData}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold/10 transition-all disabled:opacity-50"
            >
              Seed Sample Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gold text-black px-8 py-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-white transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Watch
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-gold" />
              <span className="text-green-500 text-xs font-bold">+12%</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Inventory</p>
            <p className="text-3xl text-white font-serif">{products.length} Timepieces</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-gold" />
              <span className="text-gold text-xs font-bold">+5%</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Active Collectors</p>
            <p className="text-3xl text-white font-serif">1,284 Users</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-gold" />
              <span className="text-green-500 text-xs font-bold">+24%</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Monthly Revenue</p>
            <p className="text-3xl text-white font-serif">$4.2M USD</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Watch</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Brand</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Category</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Price</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Stock</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]} alt="" className="w-12 h-12 object-cover bg-gray-900" />
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-400 text-sm">{product.brand}</td>
                    <td className="p-6 text-gray-400 text-sm">{product.category}</td>
                    <td className="p-6 text-white font-mono">{formatPrice(product.price)}</td>
                    <td className="p-6">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded",
                        product.stock < 5 ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
                      )}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gold transition-colors"><Edit className="w-4 h-4" /></button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-gold/30 p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-serif text-white mb-8">Add New Timepiece</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Watch Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Brand</label>
                <select
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.brand}
                  onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                >
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Price (USD)</label>
                <input
                  required
                  type="number"
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Stock</label>
                <input
                  required
                  type="number"
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 px-6 py-3 text-white focus:outline-none focus:border-gold"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                ></textarea>
              </div>
              
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-white/20 text-white py-4 uppercase tracking-widest text-xs hover:border-gold hover:text-gold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gold text-black py-4 uppercase tracking-widest font-bold text-xs hover:bg-white transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
