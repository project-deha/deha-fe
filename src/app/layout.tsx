import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import { Provider } from 'jotai';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DEHA - Deprem İzleme Sistemi',
    description: 'Deprem izleme ve tahmin sistemi',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                >
                    <SearchProvider>
                        <Provider>
                            <div className="flex flex-col min-h-screen">
                                {children}
                                <Footer />
                            </div>
                        </Provider>
                    </SearchProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
