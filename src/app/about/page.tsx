import { Header } from '@/components/Header';

export default function AboutPage() {
    return (
        <>
            <Header showSearch={false} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Hakkımızda</h1>
                <p>Bu sayfada DEHA hakkında bilgiler yer alacaktır.</p>
                {/* Hakkımızda içeriği buraya eklenecek */}
            </div>
        </>
    );
}
