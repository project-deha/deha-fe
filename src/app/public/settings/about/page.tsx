export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Hakkında
            </h1>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">DEHA Deprem Tahmin Sistemi</h2>
                        <p className="text-gray-600 mb-4">
                            DEHA, Türkiye'deki deprem riskini analiz eden ve tahminlerde bulunan
                            yenilikçi bir yapay zeka sistemidir. Amacımız, deprem riskini minimize
                            etmek ve toplumu bilgilendirmektir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Misyonumuz</h2>
                        <p className="text-gray-600 mb-4">
                            Deprem riskini en aza indirmek ve toplumu bilgilendirmek için
                            en son teknolojileri kullanarak güvenilir tahminler sunmak.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Teknoloji</h2>
                        <p className="text-gray-600 mb-4">
                            Sistemimiz, yapay zeka ve makine öğrenimi algoritmaları kullanarak
                            sürekli olarak kendini geliştirmekte ve daha doğru tahminler
                            yapmaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">İletişim</h2>
                        <div className="space-y-2 text-gray-600">
                            <p>
                                Adres: İstanbul, Türkiye
                            </p>
                            <p>
                                E-posta:
                                <a href="mailto:info@deha.com" className="text-blue-600 hover:text-blue-800 ml-2">
                                    info@deha.com
                                </a>
                            </p>
                            <p>
                                Telefon: +90 (212) XXX XX XX
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
} 