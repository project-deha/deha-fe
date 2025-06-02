'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Map, Table, LineChart } from 'lucide-react';

const menuItems = [
    {
        title: 'Deprem Tahminleri',
        links: [
            { label: 'Harita', href: '/user/predictions/map', icon: <Map size={18} /> },
            { label: 'Tablo', href: '/user/predictions/table', icon: <Table size={18} /> },
            { label: 'Grafik', href: '/user/predictions/graph', icon: <LineChart size={18} /> },
        ],
        icon: '🌐',
    },
    {
        title: 'Geçmiş Depremler',
        links: [
            { label: 'Harita', href: '/user/history/map', icon: <Map size={18} /> },
            { label: 'Tablo', href: '/user/history/table', icon: <Table size={18} /> },
            { label: 'Grafik', href: '/user/history/graph', icon: <LineChart size={18} /> },
        ],
        icon: '🕑',
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
        title: 'Ayarlar',
        links: [
            { label: 'Ayarlar', href: '/user/settings', icon: null },
        ],
        icon: '⚙️',
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsed = JSON.parse(user);
                    setUserName(parsed.name || 'Kullanıcı');
                } catch {
                    setUserName('Kullanıcı');
                }
            } else {
                setUserName('Kullanıcı');
            }
        }
    }, []);

    // Dummy stats
    const stats = [
        { label: 'Bugünkü Tahmin', value: '12 Deprem', icon: '📈' },
        { label: 'Son Alarm', value: 'Yok', icon: '🔔' },
        { label: 'Toplam Alarm', value: '3', icon: '🚨' },
    ];

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
            <div className="container mx-auto px-4 py-10 flex-1 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center mb-2 drop-shadow">Hoşgeldin, {userName}!</h1>
                <p className="text-center text-gray-600 mb-8">DEHA platformuna giriş yaptınız. Deprem tahminleri, geçmiş veriler ve daha fazlası elinizin altında.</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl shadow p-5 flex flex-col items-center min-w-[140px] border border-blue-100">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-lg font-bold text-blue-700">{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {menuItems.map((item) => (
                        <div key={item.title} className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center hover:-translate-y-1 hover:shadow-2xl transition border border-blue-100 group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h2 className="text-xl font-bold mb-2 text-blue-800">{item.title}</h2>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {item.links.map((link) => (
                                    <Link key={link.href} href={link.href} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition flex items-center gap-2">
                                        {link.icon ? link.icon : link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="flex justify-center mt-auto">
                    <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition">
                        Çıkış Yap
                    </button>
                </div>
            </div>

        </div>
    );
} 