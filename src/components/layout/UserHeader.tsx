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
            <div className="container mx-auto grid grid-cols-3 items-center py-4 px-4 gap-4">
                <div className="flex justify-start">
                    <Link href="/user/home" className="text-4xl font-bold mb-0">
                        DEHA
                    </Link>
                </div>
                {showSearchBar && (
                    <div className="flex justify-center">
                        <SearchBar mode={isPredictionPage ? 'prediction' : 'history'} />
                    </div>
                )}
                {!showSearchBar && <div></div>}
                <div className="flex justify-end">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
} 