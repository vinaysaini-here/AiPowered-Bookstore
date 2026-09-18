"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Book } from "@/types/book";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { ShoppingCart, Sparkles, BookOpen } from "lucide-react";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${params.id}`);
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (book) {
      if (!user) {
        toast.error("Please login to add items to cart");
        router.push(`/login?message=Please%20login%20to%20add%20items%20to%20cart&redirect=books/${book._id}`);
        return;
      }

      try {
        await addToCart({
          _id: book._id,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          qty: 1,
        });
        toast.success("Added to cart!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to add item to cart");
      }
    }
  };

  const generateSummary = async () => {
    if (!book) return;

    try {
      setGenerating(true);

      const { data } = await api.post("/ai/summarize", {
        bookId: book._id,
      });

      // ✅ FIX: correct response mapping
      const aiSummary = data?.data?.summary || "No summary available";

      setSummary(aiSummary);
      toast.success("AI Summary generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Book not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12">
            
            {/* Image Section */}
            <div className="bg-slate-100 rounded-2xl flex items-center justify-center max-h-[600px] overflow-hidden">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-6 w-max">
                {book.category}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-2">
                {book.title}
              </h1>

              <p className="text-xl text-slate-500 mb-8 font-medium">
                By {book.author}
              </p>

              <div className="text-3xl font-extrabold text-slate-900 mb-8">
                ₹{book.price}
              </div>

              <p className="text-slate-600 leading-relaxed mb-10">
                {book.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 px-8 rounded-full hover:bg-indigo-700 transition shadow-sm"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={generateSummary}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 font-bold py-4 px-8 rounded-full hover:bg-purple-100 transition shadow-sm disabled:opacity-50"
                >
                  <Sparkles size={20} />
                  {generating
                    ? "Generating AI Summary..."
                    : "AI Summary"}
                </button>

               
              </div>

              {/* 🔥 Loader */}
              {generating && (
                <div className="mt-4 animate-pulse bg-slate-200 h-24 rounded-xl" />
              )}

              {/* ✅ AI Summary */}
              {summary && !generating && (
                <div className="mt-6 bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
                  
                  <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold text-lg">
                    <Sparkles size={22} />
                    <h3>AI Generated Summary</h3>
                  </div>

                  <div className="text-slate-700 leading-relaxed">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (summary || "")
                          .replace(/\n\n/g, "<br/><br/>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
