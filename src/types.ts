export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: 'USD' | 'INR';
  description: string;
  category: string;
  images: string[];
  specifications: {
    caseSize: string;
    movement: string;
    powerReserve: string;
    waterResistance: string;
    material: string;
    strap: string;
  };
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'customer';
  createdAt: string;
  wishlist: string[];
  cart: CartItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
