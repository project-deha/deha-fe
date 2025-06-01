export default function UserSettingsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Ayarlar
            </h1>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Gizlilik Politikası */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">Gizlilik Politikası</h2>
                        <p className="text-gray-600 mb-4">
                            Kişisel verilerinizin nasıl kullanıldığı ve korunduğu hakkında bilgi alın.
                        </p>
                        <a href="/user/settings/privacy" className="text-blue-600 hover:text-blue-800">
                            Gizlilik Politikasını Görüntüle →
                        </a>
                    </div>

                    {/* Yardım/SSS */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">Yardım/SSS</h2>
                        <p className="text-gray-600 mb-4">
                            Sıkça sorulan sorular ve yardım dokümanlarına erişin.
                        </p>
                        <a href="/user/settings/help" className="text-blue-600 hover:text-blue-800">
                            Yardım Merkezini Görüntüle →
                        </a>
                    </div>

                    {/* Hakkında */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Hakkında</h2>
                        <p className="text-gray-600 mb-4">
                            Uygulama hakkında detaylı bilgi ve iletişim bilgileri.
                        </p>
                        <a href="/user/settings/about" className="text-blue-600 hover:text-blue-800">
                            Hakkında Sayfasını Görüntüle →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 