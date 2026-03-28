import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  if (cart.length === 0 && step !== 3) {
    navigate('/collection');
    return null;
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setStep(3);
    clearCart();
    toast.success('Order placed successfully!');
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                step >= s ? "bg-gold border-gold text-black" : "bg-black border-white/20 text-gray-500"
              )}
            >
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-serif text-white mb-8">Shipping Information</h2>
            <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Shipping Address</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">City</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Postal Code</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 bg-gold text-black py-5 uppercase tracking-widest font-bold text-sm hover:bg-white transition-all mt-6"
              >
                Continue to Payment
              </button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-serif text-white mb-8">Payment Details</h2>
            <div className="bg-white/5 border border-white/10 p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-gold" />
                  <div>
                    <p className="text-white font-bold">Secure Payment</p>
                    <p className="text-gray-500 text-xs">All transactions are encrypted and secure.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-white/10 rounded"></div>
                  <div className="w-10 h-6 bg-white/10 rounded"></div>
                  <div className="w-10 h-6 bg-white/10 rounded"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Card Number</label>
                  <input
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full bg-black border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-black border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">CVV</label>
                    <input
                      type="text"
                      placeholder="***"
                      className="w-full bg-black border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 mb-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-400 text-sm uppercase tracking-widest">Final Amount</span>
                <span className="text-3xl text-gold font-mono tracking-tighter">{formatPrice(cartTotal * 1.08)}</span>
              </div>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest text-right">Includes insurance and taxes</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-white/20 text-white py-5 uppercase tracking-widest font-bold text-sm hover:border-gold hover:text-gold transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-[2] bg-gold text-black py-5 uppercase tracking-widest font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Complete Investment
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-10">
              <CheckCircle2 className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-5xl font-serif text-white mb-6">Order Confirmed</h2>
            <p className="text-gray-400 mb-12 max-w-md mx-auto leading-relaxed">
              Your timepiece is being prepared for insured delivery. 
              A confirmation email has been sent to <span className="text-white">{formData.email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/profile"
                className="bg-white/10 text-white px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all"
              >
                Track Order
              </Link>
              <Link
                to="/"
                className="bg-gold text-black px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-white transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
