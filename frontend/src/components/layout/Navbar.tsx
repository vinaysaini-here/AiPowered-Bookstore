"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, User, LogOut, Bot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout, checkAuth } = useAuthStore();
  const { cartItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      useCartStore.getState().fetchCart();
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AI<span className="text-indigo-600">Bookstore</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/books" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
              Browse Books
            </Link>
            <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition flex items-center gap-1">
              <Bot size={16} />
              AI Assistant
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition">
              <ShoppingCart size={20} />
              {mounted && cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {mounted ? (
              user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-indigo-600">
                    <User size={16} />
                    <span>{user.name}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-xs bg-slate-100 text-slate-600 py-1 px-2 rounded font-semibold hover:bg-slate-200">
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                    Log in
                  </Link>
                  <Link href="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition shadow-sm">
                    Sign up
                  </Link>
                </div>
              )
            ) : (
                <div className="w-20 h-8 animate-pulse bg-slate-100 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
