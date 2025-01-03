import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 DEHA. Tüm hakları saklıdır.
                        </p>
                    </div>
                    <nav>
                        <ul className="flex space-x-4">

                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

