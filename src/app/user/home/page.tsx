'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Map, Table, LineChart } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const menuItems = [
    {
        title: 'Deprem Tahminleri',
        links: [
            { label: 'Harita', href: '/user/predictions/map', icon: <Map size={18} /> },
            { label: 'Tablo', href: '/user/predictions/table', icon: <Table size={18} /> },
            { label: 'Grafik', href: '/user/predictions/graph', icon: <LineChart size={18} /> },
        ],
        icon: '🔮',
    },
    {
        title: 'Geçmiş Depremler',
        links: [
            { label: 'Harita', href: '/user/history/map', icon: <Map size={18} /> },
            { label: 'Tablo', href: '/user/history/table', icon: <Table size={18} /> },
            { label: 'Grafik', href: '/user/history/graph', icon: <LineChart size={18} /> },
        ],
        icon: '⏳',
    },
    {
        title: 'Alarmlar',
        links: [
            { label: 'Alarmlar', href: '/user/alarms', icon: null },
        ],
        icon: '⏰',
    },
    {
        title: 'Raporlar',
        links: [
            { label: 'Raporlar', href: '/user/reports', icon: null },
        ],
        icon: '📄',
    },
    {
        title: 'Bilgi ve Yardım',
        links: [
            { label: 'Bilgi ve Yardım', href: '/user/settings', icon: null },
        ],
        icon: 'ℹ️',
    },
    {
        title: 'Profil',
        links: [
            { label: 'Profil', href: '/user/profile', icon: null },
        ],
        icon: '👤',
    },
];

export default function UserHomePage() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (user) {
            // Zustand store'dan kullanıcı adını al
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            setUserName(fullName || 'Kullanıcı');
        } else {
            // Fallback olarak localStorage'ı kontrol et
            if (typeof window !== 'undefined') {
                const localUser = localStorage.getItem('user');
                if (localUser) {
                    try {
                        const parsed = JSON.parse(localUser);
                        const fullName = `${parsed.name || parsed.firstName || ''} ${parsed.surname || parsed.lastName || ''}`.trim();
                        setUserName(fullName || 'Kullanıcı');
                    } catch {
                        setUserName('Kullanıcı');
                    }
                } else {
                    setUserName('Kullanıcı');
                }
            }
        }
        setLoading(false);
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
            <div className="container mx-auto px-4 py-10 flex-1 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center mb-2 drop-shadow">
                    {loading ? 'Hoşgeldin!' : `Hoşgeldin, ${userName}!`}
                </h1>
                <p className="text-center text-gray-600 mb-8">DEHA platformuna giriş yaptınız. Deprem tahminleri, geçmiş veriler ve daha fazlası elinizin altında.</p>

                {/* Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {menuItems.map((item) => (
                        <div key={item.title} className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl transition border border-blue-100 group">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h2 className="text-2xl font-bold mb-4 text-blue-800">{item.title}</h2>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {item.links.map((link) => (
                                    <Link key={link.href} href={link.href} className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition flex items-center gap-2">
                                        {link.icon ? link.icon : link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
} 