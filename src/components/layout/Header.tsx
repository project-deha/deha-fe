'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimatedTitle from '@/components/animations/AnimatedTitle';
import Menu from './Menu';
import SearchBar from '../search/SearchBar';

const Header = () => {
    const pathname = usePathname();
    const showSearchBar = pathname === '/public/predictions/map' || pathname === '/public/predictions/table';
    const isPredictionPage = pathname.includes('/predictions/');

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/public/home" className="flex-shrink-0">
                        <AnimatedTitle
                            text="DEHA"
                            className="text-4xl font-bold mb-0"
                        />
                    </Link>

                    {/* SearchBar - Sadece map ve tablo sayfalarında göster */}
                    {showSearchBar && (
                        <div className="flex-1 mx-8">
                            <SearchBar mode={isPredictionPage ? 'prediction' : 'history'} />
                        </div>
                    )}

                    {/* Menü */}
                    <div className="flex-shrink-0">
                        <Menu />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header; 