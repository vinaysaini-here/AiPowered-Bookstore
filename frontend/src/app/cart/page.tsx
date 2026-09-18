"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, fetchCart, isLoading } = useCartStore();
  const { user, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login?message=Please%20login%20to%20add%20items%20to%20cart&redirect=cart");
      return;
    }

    fetchCart();
  }, [fetchCart, mounted, router, user]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(id, quantity);
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  if (!mounted || !user) return null;

  if (isLoading) {
    return <div className="min-h-screen pt-24 text-center font-semibold text-slate-700">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-sm">Looks like you haven't added any books to your cart yet.</p>
        <Link href="/books" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition">
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 items-center">
                <img src={item.imageUrl} alt={item.title} className="w-24 h-32 object-cover rounded-xl border border-slate-100" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <div className="text-indigo-600 font-bold mb-4">Rs. {item.price}</div>
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                    <button
                      onClick={() => handleQuantity(item._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-10 text-center text-sm font-bold text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => handleQuantity(item._id, item.qty + 1)}
                      className="p-2 text-slate-600 hover:text-indigo-600"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-slate-900">Rs. {total}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-extrabold text-indigo-600">Rs. {total}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-full hover:bg-slate-800 transition shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
