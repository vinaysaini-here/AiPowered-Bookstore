import Link from "next/link";
import { Sparkles, MessageSquare, BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-500 text-white p-1.5 rounded-lg">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                AI<span className="text-indigo-400">Bookstore</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Experience the future of reading with AI-powered book recommendations, summaries, and an intelligent assistant.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <BookOpen size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <Heart size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/books" className="hover:text-indigo-400 transition">Browse Books</Link></li>
              <li><Link href="/categories" className="hover:text-indigo-400 transition">Categories</Link></li>
              <li><Link href="/bestsellers" className="hover:text-indigo-400 transition">Bestsellers</Link></li>
              <li><Link href="/new-releases" className="hover:text-indigo-400 transition">New Releases</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">AI Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="hover:text-indigo-400 transition">Book Assistant</Link></li>
              <li><Link href="/books" className="hover:text-indigo-400 transition">Smart Search</Link></li>
              <li><Link href="/recommendations" className="hover:text-indigo-400 transition">Personalized Recs</Link></li>
              <li><span className="text-slate-500 line-through">Audio Summaries</span> <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded ml-1">Soon</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-indigo-400 transition">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-indigo-400 transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-indigo-400 transition">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AI Bookstore. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
