import { Product } from './types';

export const SAMPLE_WATCHES: Partial<Product>[] = [
  {
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 15500,
    currency: 'USD',
    category: 'Luxury',
    description: 'The archetype of the divers’ watch, the Submariner exemplifies the historic link between Rolex and the underwater world.',
    images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '41mm',
      movement: 'Automatic 3235',
      powerReserve: '70 hours',
      waterResistance: '300m',
      material: 'Oystersteel',
      strap: 'Oyster bracelet'
    },
    stock: 5,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true
  },
  {
    name: 'Speedmaster Moonwatch',
    brand: 'Omega',
    price: 7600,
    currency: 'USD',
    category: 'Sports Watches',
    description: 'The Speedmaster Moonwatch is one of the world’s most iconic timepieces. Having been a part of all six moon missions.',
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '42mm',
      movement: 'Manual Calibre 3861',
      powerReserve: '50 hours',
      waterResistance: '50m',
      material: 'Steel',
      strap: 'Steel bracelet'
    },
    stock: 10,
    rating: 4.8,
    reviewsCount: 95,
    isFeatured: true
  },
  {
    name: 'Nautilus 5711/1A',
    brand: 'Patek Philippe',
    price: 125000,
    currency: 'USD',
    category: 'Limited Edition',
    description: 'With the rounded octagonal shape of its bezel, the Nautilus has exemplified the elegant sports watch since 1976.',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '40mm',
      movement: 'Automatic 26-330 S C',
      powerReserve: '45 hours',
      waterResistance: '120m',
      material: 'Steel',
      strap: 'Steel bracelet'
    },
    stock: 1,
    rating: 5.0,
    reviewsCount: 42,
    isFeatured: true
  },
  {
    name: 'Royal Oak Selfwinding',
    brand: 'Audemars Piguet',
    price: 45000,
    currency: 'USD',
    category: 'Luxury',
    description: 'The Royal Oak is a masterpiece of modern horology, featuring the iconic octagonal bezel and "Tapisserie" dial.',
    images: ['https://images.unsplash.com/photo-1526045431048-f857369aba09?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '41mm',
      movement: 'Automatic 4302',
      powerReserve: '70 hours',
      waterResistance: '50m',
      material: 'Titanium',
      strap: 'Titanium bracelet'
    },
    stock: 3,
    rating: 4.9,
    reviewsCount: 67,
    isFeatured: true
  },
  {
    name: 'Carrera Chronograph',
    brand: 'TAG Heuer',
    price: 6400,
    currency: 'USD',
    category: 'Sports Watches',
    description: 'A classic racing chronograph designed for professional drivers and sports-car enthusiasts.',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbaba94cf0e?auto=format&fit=crop&q=80&w=1000'],
    specifications: {
      caseSize: '42mm',
      movement: 'Automatic Heuer 02',
      powerReserve: '80 hours',
      waterResistance: '100m',
      material: 'Steel',
      strap: 'Leather strap'
    },
    stock: 15,
    rating: 4.7,
    reviewsCount: 84,
    isFeatured: false
  }
];
