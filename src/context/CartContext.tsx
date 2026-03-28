import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile) {
      setCart(userProfile.cart || []);
      setWishlist(userProfile.wishlist || []);
    } else {
      const savedCart = localStorage.getItem('chrono_cart');
      const savedWishlist = localStorage.getItem('chrono_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    }
  }, [userProfile]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('chrono_cart', JSON.stringify(cart));
      localStorage.setItem('chrono_wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user]);

  const syncToFirebase = async (newCart: CartItem[], newWishlist: string[]) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          cart: newCart,
          wishlist: newWishlist
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newCart = [...prev, { productId: product.id, quantity, product }];
      }
      syncToFirebase(newCart, wishlist);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.productId !== productId);
      syncToFirebase(newCart, wishlist);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      syncToFirebase(newCart, wishlist);
      return newCart;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      syncToFirebase(cart, newWishlist);
      return newWishlist;
    });
  };

  const clearCart = () => {
    setCart([]);
    syncToFirebase([], wishlist);
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
