'use client';

import React from 'react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Kullanım Koşulları
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Genel Hükümler</h3>
                            <p>
                                Bu kullanım koşulları, DEHA (Deprem Erken Uyarı ve Analiz Sistemi) platformunun kullanımını düzenler.
                                Platformu kullanarak bu koşulları kabul etmiş sayılırsınız.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Hizmetin Tanımı</h3>
                            <p>
                                DEHA, deprem verilerini analiz eden ve kullanıcılara bilgilendirme amacıyla sunulan bir platformdur.
                                Platform, deprem tahmin ve analiz hizmetleri sunar ancak bu bilgiler kesin tahmin niteliği taşımaz.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Kullanıcı Sorumlulukları</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Doğru ve güncel bilgiler sağlamak</li>
                                <li>Hesap güvenliğini sağlamak</li>
                                <li>Platformu yasalara uygun şekilde kullanmak</li>
                                <li>Başkalarının haklarına saygı göstermek</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Veri Kullanımı ve Gizlilik</h3>
                            <p>
                                Kişisel verileriniz yalnızca hizmet sunumu amacıyla kullanılır. Verileriniz üçüncü şahıslarla
                                paylaşılmaz ve güvenlik önlemleri ile korunur.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Deprem Tahmin Uyarıları</h3>
                            <p className="text-red-600 font-medium">
                                ÖNEMLİ: Platform tarafından sunulan deprem tahmin ve analiz bilgileri bilimsel araştırma
                                amaçlıdır ve kesin tahmin niteliği taşımaz. Bu bilgiler resmi deprem uyarı sistemlerinin
                                yerine geçmez.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Sorumluluk Sınırlaması</h3>
                            <p>
                                DEHA, sunulan bilgilerin doğruluğu konusunda garanti vermez. Platform bilgilerine dayanarak
                                alınan kararlardan doğacak zararlardan sorumlu tutulamaz.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Alarm ve Bildirim Hizmetleri</h3>
                            <p>
                                E-posta alarm sistemi en iyi çaba temelinde çalışır. Teknik arızalar nedeniyle
                                bildirimlerin gecikmesi veya ulaşmaması durumunda DEHA sorumlu tutulamaz.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Hizmet Değişiklikleri</h3>
                            <p>
                                DEHA, hizmetlerinde değişiklik yapma, hizmeti geçici veya kalıcı olarak durdurma
                                hakkını saklı tutar.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">9. İletişim</h3>
                            <p>
                                Kullanım koşulları ile ilgili sorularınız için:
                                <a href="mailto:projectdeha2025@gmail.com" className="text-blue-600 hover:underline ml-1">
                                    projectdeha2025@gmail.com
                                </a>
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Güncellemeler</h3>
                            <p>
                                Bu kullanım koşulları zaman zaman güncellenebilir. Güncellemeler platform üzerinden
                                duyurulacaktır.
                            </p>
                        </section>

                        <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
                            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Anladım
                    </button>
                </div>
            </div>
        </div>
    );
} 