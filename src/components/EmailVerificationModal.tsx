'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export function EmailVerificationModal({ isOpen, onClose, onVerify }: { isOpen: boolean; onClose: () => void; onVerify: (code: string) => void }) {
    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (verificationCode.length !== 6) {
            setError('Doğrulama kodu 6 haneli olmalıdır')
        } else {
            onVerify(verificationCode)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>E-posta Doğrulama</DialogTitle>
                    <DialogDescription>
                        E-postanıza gönderilen 6 haneli doğrulama kodunu girin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="verificationCode" className="text-right">
                                Kod
                            </label>
                            <Input
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="col-span-3"
                                maxLength={6}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Doğrula</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

