'use client';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    {/* İletişim Bilgileri */}
                    <div className="flex flex-col sm:items-start items-center">
                        <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                        <ul className="space-y-2 text-center sm:text-left">
                            <li>
                                <a href="mailto:info@deha.com" className="hover:text-blue-400 transition-colors">
                                    info@deha.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+902121234567" className="hover:text-blue-400 transition-colors">
                                    +90 (212) 123 45 67
                                </a>
                            </li>
                            <li className="text-gray-400">
                                Ankara, Türkiye
                            </li>
                        </ul>
                    </div>

                    {/* Telif Hakkı */}
                    <div className="flex flex-col items-center sm:items-end">
                        <p className="text-gray-400">&copy; {currentYear} DEHA. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 