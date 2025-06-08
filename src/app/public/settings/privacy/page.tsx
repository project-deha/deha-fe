export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Gizlilik Politikası
            </h1>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Veri Toplama ve Kullanım</h2>
                        <p className="text-gray-600 mb-4">
                            DEHA Deprem Tahmin Sistemi, kullanıcıların gizliliğini korumak için tasarlanmıştır.
                            Sistemimiz, deprem tahminleri için gerekli olan minimum veriyi toplar ve kullanır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Toplanan Veriler</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Konum bilgisi (deprem tahminleri için)</li>
                            <li>Kullanım istatistikleri (sistem iyileştirmeleri için)</li>
                            <li>Teknik veriler (performans optimizasyonu için)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Veri Güvenliği</h2>
                        <p className="text-gray-600 mb-4">
                            Tüm veriler şifrelenerek saklanır ve üçüncü taraflarla paylaşılmaz.
                            Verileriniz sadece deprem tahmin sisteminin iyileştirilmesi amacıyla kullanılır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">İletişim</h2>
                        <p className="text-gray-600">
                            Gizlilik politikamız hakkında sorularınız için:
                            <a href="mailto:projectdeha2025@gmail.com" className="text-blue-600 hover:text-blue-800 ml-2">
                                projectdeha2025@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
} 