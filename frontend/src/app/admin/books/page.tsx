"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Settings, BookOpen, PlusSquare, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { Book } from "@/types/book";
import BookFormModal from "@/components/admin/BookFormModal";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push("/");
      return;
    }
    fetchBooks();
  }, [user, router]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/books");
      setBooks(data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        toast.success("Book deleted");
        fetchBooks();
      } catch (error) {
        toast.error("Failed to delete book");
      }
    }
  };

  const openAddModal = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Settings className="text-indigo-600" size={32} />
            Admin Dashboard
          </h1>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm"
          >
            <PlusSquare size={20} />
            Add New Book
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="text-slate-500" />
              Inventory Management
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Book ID / Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading catalog...</td></tr>
                ) : books.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Inventory is empty.</td></tr>
                ) : (
                  books.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={b.imageUrl} className="w-10 h-10 object-cover rounded bg-slate-100" />
                          <div>
                            <p className="font-bold text-slate-900 text-base">{b.title}</p>
                            <p className="text-xs text-slate-500 font-mono">{b._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{b.author}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{b.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${b.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {b.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openEditModal(b)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <BookFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBooks}
        bookToEdit={bookToEdit}
      />
    </div>
  );
}
