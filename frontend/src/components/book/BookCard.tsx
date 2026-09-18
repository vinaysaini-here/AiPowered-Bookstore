"use client";

import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book"; // will create types
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login?message=Please%20login%20to%20add%20items%20to%20cart&redirect=books");
      return;
    }

    try {
      await addToCart({
        _id: book._id,
        title: book.title,
        price: book.price,
        imageUrl: book.imageUrl,
        qty: 1
      });
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        <img 
          src={book.imageUrl} 
          alt={book.title} 
          className="h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link 
              href={`/books/${book._id}`}
              className="bg-white text-slate-900 font-medium py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              Quick View
            </Link>
        </div>
      </div>
      <div className="p-5">
        <div className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
          {book.category}
        </div>
        <Link href={`/books/${book._id}`}>
          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 line-clamp-1 hover:text-indigo-600 transition">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mb-4">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">₹{book.price}</span>
          <button 
            onClick={handleAddToCart}
            className="text-sm bg-slate-900 hover:bg-indigo-600 text-white py-1.5 px-4 rounded-full transition-colors duration-300 shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
