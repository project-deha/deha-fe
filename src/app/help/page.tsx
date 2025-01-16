'use client';

import { Header } from '@/components/Header';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// FAQ tipi tanımlama
type FAQItem = {
    question: string;
    answer: string;
};

// FAQ grupları
type FAQGroup = {
    title: string;
    items: FAQItem[];
};

// Accordion bileşeni
const Accordion = ({ question, answer }: FAQItem) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded-lg mb-2">
            <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="px-6 py-4 border-t">
                    <p className="text-muted-foreground">{answer}</p>
                </div>
            )}
        </div>
    );
};

export default function HelpPage() {
    const faqGroups: FAQGroup[] = [
        {
            title: 'Genel Sorular',
            items: [
                {
                    question: 'DEHA nedir?',
                    answer: 'DEHA, deprem tahminleme konusunda yapay zeka ve veri analitiği teknolojilerini kullanan öncü bir platformdur. Amacımız, olası deprem hareketlerini önceden tahmin ederek toplumu bilgilendirmektir.',
                },
                {
                    question: 'DEHA nasıl çalışır?',
                    answer: 'DEHA, gelişmiş algoritmalar ve yapay zeka modelleri kullanarak sismik verileri analiz eder. Geçmiş deprem verileri, yer hareketleri ve diğer çevresel faktörleri değerlendirerek tahminler oluşturur.',
                },
            ],
        },
        {
            title: 'Hesap ve Güvenlik',
            items: [
                {
                    question: 'Nasıl üye olabilirim?',
                    answer: 'Sağ üst köşedeki menüden "Kaydol" butonuna tıklayarak üyelik formunu doldurabilirsiniz. E-posta adresinizi doğruladıktan sonra hesabınız aktif hale gelecektir.',
                },
                {
                    question: 'Nasıl giriş yapabilirim?',
                    answer: 'Sağ üst köşedeki menüden "Oturum Aç" butonuna tıklayarak mail ve şifrenizi girerek giriş yapabilirsiniz.',
                },
            ],
        },
        {
            title: 'Tahminler ve Veriler',
            items: [
                {
                    question: 'Tahminler ne kadar güvenilir?',
                    answer: 'Tahminlerimiz, bilimsel veriler ve gelişmiş algoritmalar kullanılarak oluşturulur. Ancak, depremlerin karmaşık doğası gereği, tahminler kesin sonuçlar değil, olasılıklar sunar.',
                }
            ],
        },
    ];

    return (
        <>
            <Header showSearch={false} />

            {/* Hero Section with Back Button */}
            <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Ayarlara Dön</span>
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        Yardım Merkezi
                    </h1>
                    <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                        Sıkça sorulan sorular ve yardım içeriğimizde ihtiyacınız olan bilgileri bulabilirsiniz.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 py-12">
                {faqGroups.map((group, index) => (
                    <div key={index} className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6">{group.title}</h2>
                        <div className="space-y-4">
                            {group.items.map((item, itemIndex) => (
                                <Accordion
                                    key={itemIndex}
                                    question={item.question}
                                    answer={item.answer}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </>
    );
}
