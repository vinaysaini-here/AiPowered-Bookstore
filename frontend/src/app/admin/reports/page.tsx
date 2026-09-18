"use client";

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { BarChart3, TrendingUp, BookOpen, Download, ShoppingCart } from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AdminReports() {
    const { reports, fetchReports, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    if (isLoading && !reports) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;
    if (!reports) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="text-teal-500" />
                    Advanced Analytics
                </h1>
                <button 
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    onClick={() => window.print()}
                >
                    <Download size={16} />
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Orders Trend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">7-Day Revenue Trend</h2>
                        <TrendingUp className="text-teal-500" size={20} />
                    </div>
                    <div className="h-72">
                        {reports.dailyOrders && reports.dailyOrders.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={reports.dailyOrders}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} 
                                        tickFormatter={(val) => val.split('-').slice(1).join('/')} 
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">Not enough data</div>
                        )}
                    </div>
                </div>

                {/* Daily Orders Count */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">7-Day Orders Volume</h2>
                        <ShoppingCart className="text-blue-500" size={20} />
                    </div>
                    <div className="h-72">
                        {reports.dailyOrders && reports.dailyOrders.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reports.dailyOrders}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} 
                                        tickFormatter={(val) => val.split('-').slice(1).join('/')} 
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">Not enough data</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Selling Books Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="text-orange-500" size={20} />
                    <h2 className="text-lg font-semibold text-slate-800">Top Selling Books</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-y border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-4 font-medium">Rank</th>
                                <th className="px-6 py-4 font-medium">Book Title</th>
                                <th className="px-6 py-4 font-medium text-right">Units Sold</th>
                                <th className="px-6 py-4 font-medium text-right">Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.topBooks && reports.topBooks.length > 0 ? (
                                reports.topBooks.map((book: any, idx: number) => (
                                    <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                idx === 2 ? 'bg-orange-100 text-orange-800' :
                                                'bg-slate-50 text-slate-500'
                                            }`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{book.title}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-700">{book.totalSold}</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{book.revenue.toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No sales data available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
