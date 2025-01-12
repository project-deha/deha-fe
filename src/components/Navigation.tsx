'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { RegisterDialog } from './auth/RegisterDialog';
import { LoginDialog } from './auth/LoginDialog';

export function Navigation() {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();

    const navItems = [
        { href: '#', label: 'Oturum Aç', onClick: () => setShowLogin(true) },
        { href: '#', label: 'Kayıt Ol', onClick: () => setShowRegister(true) },
        { href: '/', label: 'Ana Sayfa' },
        { href: '/predictions', label: 'Tahminler' },
        { href: '/settings', label: 'Ayarlar' },
    ];

    const handleNavigation = (item: (typeof navItems)[0]) => {
        if (item.onClick) {
            item.onClick();
        } else {
            router.push(item.href);
        }
    };

    return (
        <nav className="z-20 relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {navItems.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            onSelect={() => handleNavigation(item)}
                        >
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <LoginDialog
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
            />

            <RegisterDialog
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
            />
        </nav>
    );
}
