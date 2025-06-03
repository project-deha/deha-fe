'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import axiosInstance from '@/config/axios';

const predictionsSubmenu = [
    { label: 'Harita', href: '/user/predictions/map', icon: <span className="mr-2">🗺️</span> },
    { label: 'Tablo', href: '/user/predictions/table', icon: <span className="mr-2">📋</span> },
    { label: 'Grafik', href: '/user/predictions/graph', icon: <span className="mr-2">📈</span> },
];
const historySubmenu = [
    { label: 'Harita', href: '/user/history/map', icon: <span className="mr-2">🗺️</span> },
    { label: 'Tablo', href: '/user/history/table', icon: <span className="mr-2">📋</span> },
    { label: 'Grafik', href: '/user/history/graph', icon: <span className="mr-2">📈</span> },
];

const menuItems = [
    { label: 'Anasayfa', href: '/user/home', icon: <span className="mr-2">🏠</span> },
    { label: 'Tahminler', icon: <span className="mr-2">🔮</span>, submenu: predictionsSubmenu },
    { label: 'Geçmiş Depremler', icon: <span className="mr-2">⏳</span>, submenu: historySubmenu },
    { label: 'Profilim', href: '/user/profile', icon: <span className="mr-2">👤</span> },
    { label: 'Ayarlar', href: '/user/settings', icon: <span className="mr-2">⚙️</span> },
    { label: 'Alarmlar', href: '/user/alarms', icon: <span className="mr-2">⏰</span> },
    { label: 'Raporlar', href: '/user/reports', icon: <span className="mr-2">📄</span> },
];

export default function UserMenu() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [accordion, setAccordion] = useState<string | null>(null);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setDrawerOpen(false);
                setAccordion(null);
            }
        }
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [drawerOpen]);

    const handleLogout = async () => {
        try {
            await axiosInstance.get('auth/logout');
            useUserStore.getState().clearUser();
            setDrawerOpen(false);
            router.push('/public/home');
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if the request fails, we'll still clear the local state
            useUserStore.getState().clearUser();
            setDrawerOpen(false);
            router.push('/public/home');
        }
    };

    return (
        <>
            {/* Menü butonu */}
            <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition border border-blue-100"
            >
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {user ? user.firstName.charAt(0) : 'U'}
                </span>
                <span className="hidden md:block font-medium text-gray-700">
                    {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
                </span>
                <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </button>

            {/* Drawer ve blur arka plan */}
            {drawerOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setDrawerOpen(false)} />
                    <aside ref={menuRef} className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex items-center gap-2">
                                <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                    {user ? user.firstName.charAt(0) : 'U'}
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
                                </span>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="text-gray-500 hover:text-red-600 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                            {menuItems.map((item) =>
                                item.submenu ? (
                                    <div key={item.label}>
                                        <button
                                            className="flex items-center w-full px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 font-medium transition justify-between"
                                            onClick={() => setAccordion(accordion === item.label ? null : item.label)}
                                        >
                                            <span className="flex items-center">{item.icon}{item.label}</span>
                                            <svg className={`w-4 h-4 ml-2 transition-transform ${accordion === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {accordion === item.label && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {item.submenu.map((sub) => (
                                                    <Link
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className="flex items-center px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700 text-sm transition"
                                                        onClick={() => { setDrawerOpen(false); setAccordion(null); }}
                                                    >
                                                        {sub.icon}{sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 font-medium transition"
                                        onClick={() => setDrawerOpen(false)}
                                    >
                                        {item.icon}{item.label}
                                    </Link>
                                )
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium mt-4"
                            >
                                <span className="mr-2">🚪</span>Çıkış Yap
                            </button>
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}

// Tailwind animasyonunu eklemeyi unutmayın:
// tailwind.config.js -> theme.extend.animation.slide-in = 'slide-in 0.3s ease-out'
// @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } } 