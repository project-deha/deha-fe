import { Map, Table } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
            {/* Hero Section */}
            <section className="text-center py-16 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">DEHA: Deprem Tahmin ve Analiz Platformu</h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                    Türkiye'nin deprem riskini harita ve tablo ile keşfedin. Bilimsel tahminler, güncel analizler ve modern arayüz ile güvenliğiniz için buradayız.
                </p>
            </section>

            {/* Main Cards */}
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
                    {/* Harita Kartı */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl group border border-blue-100">
                        <div className="bg-blue-100 rounded-full p-4 mb-4">
                            <Map className="w-10 h-10 text-blue-600 group-hover:text-blue-800 transition-colors" />
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
                        <div className="bg-blue-100 rounded-full p-4 mb-4">
                            <Table className="w-10 h-10 text-blue-600 group-hover:text-blue-800 transition-colors" />
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