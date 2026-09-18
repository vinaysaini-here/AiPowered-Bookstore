"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Brain, Zap } from "lucide-react";
import BookCard from "@/components/book/BookCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Book } from "@/types/book";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books');
        setBooks(data.slice(0, 4)); // Show only 4 featured
      } catch (error) {
        console.error("Failed to fetch books", error);
        // Fallback dummy data if backend is down
        setBooks([
          { _id: '1', title: 'The AI Revolution', author: 'Jane Smith', price: 499, category: 'Technology', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500', stock: 10, description: '' },
          { _id: '2', title: 'Cosmic Journeys', author: 'Carl Sagan', price: 399, category: 'Science', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500', stock: 5, description: '' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 text-indigo-700 font-medium text-sm mb-8 border border-indigo-100 shadow-sm backdrop-blur-sm">
              <Sparkles size={16} />
              <span>Next-Gen AI Bookstore Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Find your next favorite book with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI precision</span>.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Engage with our intelligent book assistant, get semantic recommendations, and read AI-generated summaries before you buy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
                Explore Catalog
                <ArrowRight size={20} />
              </Link>
              <Link href="/chat" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm">
                <Brain size={20} className="text-purple-500" />
                Ask Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transform rotate-3">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Recommendations</h3>
              <p className="text-slate-600 leading-relaxed">Our Gemini AI analyzes your taste and queries to suggest books you&apos;re guaranteed to love.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform -rotate-3">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Semantic Search</h3>
              <p className="text-slate-600 leading-relaxed">Search by concept, feeling, or vague plot descriptions. We understand what you mean.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 transform rotate-3">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Summaries</h3>
              <p className="text-slate-600 leading-relaxed">Don&apos;t have time to read the back cover? Get a quick 3-point AI summary instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Featured Reads</h2>
              <p className="text-slate-600 text-lg">Handpicked selections to spark your imagination.</p>
            </div>
            <Link href="/books" className="hidden sm:inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(n => (
                <div key={n} className="bg-white rounded-2xl h-96 animate-pulse shadow-sm border border-slate-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
          
          <div className="mt-10 sm:hidden text-center">
            <Link href="/books" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
