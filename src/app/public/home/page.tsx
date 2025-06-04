import { Map, Table } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col py-16">
            {/* Hero Section */}
            <section className="text-center px-4 flex flex-col gap-8 w-1/2 mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">DEHA: Dinamik Deprem Felaketi Analizi</h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 ">
                    Türkiye'nin 81 ili için gelecek bir yıllık deprem tahminlerini keşfedin. Bilimsel tahminler, güncel analizler ve modern arayüz ile güvenliğiniz için buradayız.
                </p>
            </section>

            {/* Main Cards */}
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
                    {/* Harita Kartı */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl group border border-blue-100">
                        <div className="bg-blue-100 rounded-full p-4 mb-4 flex items-center justify-center">
                            <span className="text-4xl group-hover:scale-110 transition-transform">🗺️</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-800">Deprem Tahmini Haritası</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Türkiye genelinde deprem tahminlerini interaktif harita üzerinde görüntüleyin.
                        </p>
                        <a href="/public/predictions/map" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                            Haritayı Görüntüle
                        </a>
                    </div>

                    {/* Tablo Kartı */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl group border border-blue-100">
                        <div className="bg-blue-100 rounded-full p-4 mb-4 flex items-center justify-center">
                            <span className="text-4xl group-hover:scale-110 transition-transform">📋</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-800">Deprem Tahmini Tablosu</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Bölgelere göre detaylı deprem tahmin verilerini tablo halinde inceleyin.
                        </p>
                        <a href="/public/predictions/table" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                            Tabloyu Görüntüle
                        </a>
                    </div>
                </div>
            </main>

        </div>
    );
} 