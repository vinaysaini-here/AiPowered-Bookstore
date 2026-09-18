"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardNavbar from '@/components/dashboard/Navbar';

const adminPageMeta: Record<string, { title: string; subtitle: string }> = {
    '/admin': {
        title: 'Admin Overview',
        subtitle: 'A clear view of storefront operations, orders, and revenue.',
    },
    '/admin/orders': {
        title: 'Orders Management',
        subtitle: 'Track customer purchases, fulfillment, and invoice access.',
    },
    '/admin/books': {
        title: 'Books Management',
        subtitle: 'Manage the catalog, note uploads, and product inventory.',
    },
    '/admin/users': {
        title: 'Users Management',
        subtitle: 'Monitor user accounts, roles, and access.',
    },
    '/admin/reports': {
        title: 'Reports',
        subtitle: 'Review sales trends and reporting insights.',
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isMounted) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, isMounted, router]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (!isMounted || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const currentMeta = adminPageMeta[pathname] || adminPageMeta['/admin'];

    return (
        <div className="fixed inset-0 z-100 flex bg-slate-50 overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-6">
                <DashboardNavbar
                    title={currentMeta.title}
                    subtitle={currentMeta.subtitle}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main>{children}</main>
            </div>
        </div>
    );
}
