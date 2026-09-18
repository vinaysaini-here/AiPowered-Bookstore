"use client";

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { 
    Users, 
    ShoppingCart, 
    BookOpen, 
    IndianRupee,
    TrendingUp
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const { stats, fetchStats, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>;
    }

    if (!stats) return null;

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.totalSales?.toFixed(2) || '0.00'}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
        { title: 'Total Books', value: stats.totalBooks || 0, icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-sm text-slate-500">Last updated: {format(new Date(), 'PPp')}</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Up from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Revenue Overview</h2>
                    <div className="h-72">
                        {stats.salesData && stats.salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.salesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                                    <RechartsTooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No revenue data available</div>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {stats.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: any) => (
                                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{order.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-slate-500">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-800">₹{order.totalPrice.toFixed(2)}</p>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                            order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No recent orders</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
