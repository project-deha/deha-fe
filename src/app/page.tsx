import { Body } from '@/components/body'
import { Header } from '@/components/Header'

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="flex-grow relative">
                <Body />
            </div>
        </>
    )
}

