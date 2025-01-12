'use client';

import { useState } from 'react';
import {
    ChevronRight,
    Languages,
    FileText,
    HelpCircle,
    Info,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function SettingsPage() {
    const [language, setLanguage] = useState('tr');

    return (
        <>
            <Header showSearch={false} />
            <div className="container max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>

                <div className="space-y-4">
                    {/* Dil Seçimi */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <Languages className="w-5 h-5" />
                            <div>
                                <div className="font-medium">Dil</div>
                                <div className="text-sm text-muted-foreground">
                                    Dili seçiniz
                                </div>
                            </div>
                        </div>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Dil seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tr">Türkçe</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gizlilik Politikası */}
                    <Link
                        href="/privacy"
                        className="flex items-center justify-between py-2 hover:bg-accent rounded-lg px-2 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">
                                Gizlilik politikası
                            </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>

                    {/* Yardım/SSS */}
                    <Link
                        href="/help"
                        className="flex items-center justify-between py-2 hover:bg-accent rounded-lg px-2 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-medium">Yardım/SSS</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>

                    {/* Hakkında */}
                    <Link
                        href="/about"
                        className="flex items-center justify-between py-2 hover:bg-accent rounded-lg px-2 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5" />
                            <span className="font-medium">Hakkında</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>
            </div>
        </>
    );
}
