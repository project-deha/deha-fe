'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function SignUpModal({
    isOpen,
    onClose,
    onSignUp,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: (data: SignUpFormData) => void;
}) {
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: Partial<SignUpFormData> = {};
        if (!formData.name) newErrors.name = 'İsim gereklidir';
        if (!formData.email) newErrors.email = 'E-posta gereklidir';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        if (!formData.password) newErrors.password = 'Şifre gereklidir';
        else if (formData.password.length < 6)
            newErrors.password = 'Şifre en az 6 karakter olmalıdır';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSignUp(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kaydol</DialogTitle>
                    <DialogDescription>
                        Hesap oluşturmak için aşağıdaki bilgileri doldurun.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                                İsim
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="Adınızı giriniz"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">
                                E-posta
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E-posta adresinizi giriniz"
                                className="col-span-3"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="password" className="text-right">
                                Şifre
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                placeholder="Şifrenizi giriniz"
                                onChange={handleChange}
                                className="col-span-3"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label
                                htmlFor="confirmPassword"
                                className="text-right"
                            >
                                Şifre Tekrar
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                placeholder="Şifrenizi tekrar giriniz"
                                onChange={handleChange}
                                className="col-span-3"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Devam Et</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
