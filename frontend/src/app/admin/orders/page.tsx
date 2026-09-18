"use client";

import { useEffect, useMemo, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { ShoppingCart, CheckCircle, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function AdminOrders() {
    const { orders, fetchOrders, updateOrderStatus, isLoading, error } = useAdminStore();
    const [filter, setFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchOrders({ status: filter, startDate, endDate });
    }, [endDate, fetchOrders, filter, startDate]);

    const totalSales = useMemo(
        () => orders.filter((order) => order.isPaid).reduce((sum, order) => sum + order.totalPrice, 0),
        [orders]
    );

    const handleUpdateStatus = async (id: string, isDelivered: boolean, isPaid: boolean) => {
        try {
            await updateOrderStatus(id, { isDelivered, isPaid });
            toast.success('Order status updated');
        } catch {
            toast.error('Failed to update order status');
        }
    };

    const downloadInvoice = async (orderId: string) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error('Failed to download invoice');
        }
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ShoppingCart className="text-blue-500" />
                        Orders Management
                    </h1>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
                        <span className="text-xs font-semibold uppercase tracking-wide">Total Sales</span>
                        <p className="text-xl font-extrabold">Rs. {totalSales.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-2 overflow-x-auto">
                        {['All', 'Pending', 'Paid', 'Delivered', 'Processing', 'Cancelled'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    filter === f
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Payment Status</th>
                                <th className="px-6 py-4 font-medium">Order Status</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No orders found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-slate-500">{order._id}</p>
                                            <p className="font-medium text-slate-800">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-800">{order.user?.name || order.address?.fullName || 'Deleted User'}</p>
                                            <p className="text-xs text-slate-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            Rs. {order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isPaid ? (
                                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium w-fit">
                                                    <CheckCircle size={14} /> {order.paymentStatus || 'Paid'}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-medium w-fit">
                                                    <XCircle size={14} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isDelivered ? (
                                                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium w-fit">
                                                    <CheckCircle size={14} /> Delivered
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs font-medium w-fit">
                                                    <XCircle size={14} /> {order.orderStatus || 'Placed'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => downloadInvoice(order._id)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                            >
                                                <Download size={14} />
                                                Invoice
                                            </button>
                                            {!order.isPaid && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, order.isDelivered, true)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            {!order.isDelivered && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, true, order.isPaid)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
