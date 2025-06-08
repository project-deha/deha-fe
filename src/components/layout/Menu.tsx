'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthModal from '../auth/AuthModal';

const menuItems = [
    { href: '/public/home', label: 'Anasayfa', icon: <span className="mr-2">🏠</span> },
    { href: '/public/predictions/map', label: 'Harita', icon: <span className="mr-2">🗺️</span> },
    { href: '/public/predictions/table', label: 'Tablo', icon: <span className="mr-2">📋</span> },
    { href: '/public/settings', label: 'Bilgi ve Yardım', icon: <span className="mr-2">ℹ️</span> },
];

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => {
        return pathname === path;
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
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
    }, [isOpen]);

    const handleAuthClick = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
        setIsOpen(false);
    };

    return (
        <>
            {/* Menü butonu */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition border border-blue-100"
            >
                <span className="font-medium text-gray-700">Menü</span>
                <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </button>

            {/* Drawer ve blur arka plan */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsOpen(false)} />
                    <aside ref={menuRef} className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <span className="font-bold text-xl text-blue-700">Menu</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-600 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700 font-medium transition ${isActive(item.href) ? 'bg-blue-50 text-blue-700' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}{item.label}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t">
                                <button
                                    onClick={() => handleAuthClick('login')}
                                    className="flex items-center w-full px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                                >
                                    <span className="mr-2">🔑</span>Giriş Yap
                                </button>
                                <button
                                    onClick={() => handleAuthClick('register')}
                                    className="flex items-center w-full px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium mt-2"
                                >
                                    <span className="mr-2">📝</span>Kayıt Ol
                                </button>
                            </div>
                        </nav>
                    </aside>
                </>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Menu; 