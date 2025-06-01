"use client";
import Link from 'next/link';
import UserMenu from './UserMenu';
import SearchBar from '../search/SearchBar';
import { usePathname } from 'next/navigation';

export default function UserHeader() {
    const pathname = usePathname();
    const showSearchBar = [
        '/user/predictions/map',
        '/user/predictions/table',
        '/user/history/map',
        '/user/history/table',
    ].includes(pathname);
    const isPredictionPage = pathname.includes('/predictions/');

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto flex items-center justify-between py-4 px-4 gap-4">
                <Link href="/user/home" className="text-4xl font-bold mb-0">
                    DEHA
                </Link>
                {showSearchBar && (
                    <div className="flex-1 mx-8">
                        <SearchBar mode={isPredictionPage ? 'prediction' : 'history'} />
                    </div>
                )}
                <div className="ml-4">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
} 