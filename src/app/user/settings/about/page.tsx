export default function UserAboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Hakkında</h1>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Uygulama Hakkında</h2>
                    <p className="text-gray-600 mb-4">
                        Bu uygulama deprem verilerini analiz etmek, raporlamak ve kullanıcıya sunmak için geliştirilmiştir.<br />
                        İletişim: <a href="mailto:destek@deha.com" className="text-blue-600 hover:underline">destek@deha.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
