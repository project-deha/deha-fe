import { Header } from '@/components/Header'

export default function HelpPage() {
    return (
        <>
            <Header showSearch={false} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Yardım / SSS</h1>
                <p>Bu sayfada sıkça sorulan sorular ve yardım içeriği yer alacaktır.</p>
                {/* SSS ve yardım içeriği buraya eklenecek */}
            </div>
        </>
    )
}

