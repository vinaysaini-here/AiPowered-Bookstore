"use client";

import { useState, useEffect } from "react";
import { X, Upload, FileText } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Book } from "@/types/book";

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookToEdit?: Book | null;
}

export default function BookFormModal({ isOpen, onClose, onSuccess, bookToEdit }: BookFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        description: bookToEdit.description,
        price: bookToEdit.price.toString(),
        category: bookToEdit.category,
        stock: bookToEdit.stock.toString(),
      });
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
    }
    setImageFile(null);
    setDocumentFile(null);
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    
    if (imageFile) {
      data.append("image", imageFile);
    }
    if (documentFile) {
      data.append("document", documentFile);
    }

    try {
      if (bookToEdit) {
        await api.put(`/books/${bookToEdit._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book updated successfully!");
      } else {
        await api.post("/books", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">
            {bookToEdit ? "Edit Book" : "Add New Book"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Title</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="Book Title"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Author</label>
              <input 
                required
                type="text" 
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="Author Name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Price (₹)</label>
              <input 
                required
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Stock</label>
              <input 
                required
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="10"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <input 
                required
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="E.g. Fiction, Science, Non-fiction"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                placeholder="Brief description about the book..."
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Upload size={16} /> Cover Image (JPG/PNG)
              </label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
              />
              {bookToEdit?.imageUrl && !imageFile && (
                <p className="text-xs text-slate-500 mt-1">Current: {bookToEdit.imageUrl}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileText size={16} /> Book Document (PDF)
              </label>
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleDocumentChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"
              />
              {bookToEdit?.fileUrl && !documentFile && (
                <p className="text-xs text-slate-500 mt-1">Current: {bookToEdit.fileUrl}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
