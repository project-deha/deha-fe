'use client'

import React, { useState, ReactNode, ReactElement } from 'react'
import { Header } from '@/components/Header'

export function ClientLayout({ children }: { children: ReactNode }) {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="flex flex-col min-h-screen">
            <Header onSettingsClick={() => setShowSettings(true)} />
            <main className="flex-grow relative">
                {React.isValidElement(children)
                    ? React.cloneElement(children as ReactElement, { showSettings, setShowSettings })
                    : children}
            </main>
        </div>
    )
}
