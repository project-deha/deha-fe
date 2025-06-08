export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Yardım ve Sıkça Sorulan Sorular
            </h1>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Sistem Nasıl Çalışır?</h2>
                        <p className="text-gray-600 mb-4">
                            DEHA Deprem Tahmin Sistemi, yapay zeka ve makine öğrenimi algoritmaları kullanarak
                            deprem tahminleri yapar. Sistem, geçmiş deprem verilerini ve jeolojik verileri
                            analiz ederek olası depremleri öngörür.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h2>
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <h3 className="font-medium mb-2">Tahminler ne kadar güvenilir?</h3>
                                <p className="text-gray-600">
                                    Sistemimiz sürekli olarak güncellenmekte ve iyileştirilmektedir.
                                    Tahminler, bilimsel veriler ve geçmiş deneyimler ışığında yapılmaktadır.
                                </p>
                            </div>
                            <div className="border-b pb-4">
                                <h3 className="font-medium mb-2">Veriler ne sıklıkla güncellenir?</h3>
                                <p className="text-gray-600">
                                    Tahminler günlük olarak güncellenir. Önemli değişiklikler olduğunda
                                    anlık bildirimler alabilirsiniz.
                                </p>
                            </div>
                            <div className="border-b pb-4">
                                <h3 className="font-medium mb-2">Nasıl bildirim alabilirim?</h3>
                                <p className="text-gray-600">
                                    Ayarlar sayfasından bildirim tercihlerinizi yönetebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">İletişim</h2>
                        <p className="text-gray-600">
                            Başka sorularınız için:
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