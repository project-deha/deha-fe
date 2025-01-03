'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const API_HOST = 'http://localhost:8080'

// Configure axios instance
const api = axios.create({
    baseURL: API_HOST,
    withCredentials: true, // This enables cookie handling
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
})

export function VerificationDialog({
    isOpen,
    onClose,
    email,
    onVerificationComplete,
}: {
    isOpen: boolean
    onClose: () => void
    email: string
    onVerificationComplete: () => void
}) {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode]
            newCode[index] = value
            setVerificationCode(newCode)

            // Move to next input if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async () => {
        const code = verificationCode.join('')
        if (code.length === 6) {
            try {
                const response = await api.post('/api/v1/auth/verify', {
                    verificationCode: parseInt(code)
                })

                if (response.status === 200) {
                    onVerificationComplete()
                }
            } catch (error) {
                console.error('Doğrulama hatası:', error)
            }
        }
    }

    useEffect(() => {
        if (isOpen) {
            inputRefs.current[0]?.focus()
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        E-posta Doğrulama
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        E-postanıza gelen 6 haneli doğrulama kodunu giriniz.
                    </p>
                    <div className="flex justify-center gap-2">
                        {verificationCode.map((digit, index) => (
                            <Input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-lg"
                            />
                        ))}
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={verificationCode.some(digit => !digit)}
                    >
                        Devam Et
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

