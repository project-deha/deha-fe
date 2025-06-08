export default function UserHelpPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Yardım & SSS</h1>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-2">Sıkça Sorulan Sorular</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                        <li>Deprem verileri hangi sıklıkla güncelleniyor? <br /><span className="text-gray-500">Veriler günlük olarak güncellenmektedir.</span></li>
                        <li>Alarm kurduğumda bildirim alacak mıyım? <br /><span className="text-gray-500">Evet, alarmınız tetiklendiğinde e-posta ile bilgilendirileceksiniz.</span></li>
                        <li>Veriler hangi kaynaklardan alınmaktadır? <br /><span className="text-gray-500">AFAD ve Kandilli Rasathanesi gibi resmi kaynaklardan alınmaktadır.</span></li>
                    </ul>
                    <h2 className="text-xl font-semibold mb-2 mt-6">Destek</h2>
                    <p className="text-gray-600 mb-4">
                        Daha fazla yardıma ihtiyacınız varsa lütfen <a href="mailto:projectdeha2025@gmail.com" className="text-blue-600 hover:underline">projectdeha2025@gmail.com</a> adresine e-posta gönderin.
                    </p>
                </div>
            </div>
        </div>
    );
} 