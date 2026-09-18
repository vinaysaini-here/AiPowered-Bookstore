"use client";

import { Calendar, Download, Package } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface OrderHistorySectionProps {
  orders: any[];
  loading?: boolean;
  compact?: boolean;
}

export default function OrderHistorySection({
  orders,
  loading = false,
  compact = false,
}: OrderHistorySectionProps) {
  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-2xl font-bold text-slate-900">
        <Package className="text-slate-900" />
        Order History
      </h2>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {orders.slice(0, compact ? 3 : orders.length).map((order) => (
            <div key={order._id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-6 transition hover:shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Order #{order._id.substring(18)}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-xl font-extrabold text-slate-900">Rs. {order.totalPrice}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      order.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus || (order.isPaid ? "Paid" : "Pending Payment")}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {order.orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-3">
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.title}
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">Qty: {item.qty} x Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => downloadInvoice(order._id)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                <Download size={16} />
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
