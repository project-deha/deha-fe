'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { VerificationDialog } from './VerificationDialog';

const API_HOST = 'http://localhost:8080';

// Configure axios instance
const api = axios.create({
    baseURL: API_HOST,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    maxRedirects: 0,
    validateStatus: function (status) {
        return status >= 200 && status < 400;
    },
});

const formSchema = z
    .object({
        name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
        surname: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
        email: z.string().email('Geçerli bir e-posta adresi giriniz'),
        password: z
            .string()
            .min(12, 'Şifre en az 12 karakter olmalıdır'),
        confirmPassword: z.string(),
        terms: z
            .boolean()
            .refine((val) => val === true, 'Koşulları kabul etmelisiniz'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
    });

// Add these interfaces for type safety
interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    authorities: string[];
    isVerified: boolean;
}

interface GenericResponse<T> {
    statusCode: number;
    data: T;
    error: any;
}

export function RegisterDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [showVerification, setShowVerification] = useState(false);
    const [email, setEmail] = useState('');
    const [showNameHelp, setShowNameHelp] = useState(true);
    const [showSurnameHelp, setShowSurnameHelp] = useState(true);
    const [showEmailHelp, setShowEmailHelp] = useState(true);
    const [showPasswordHelp, setShowPasswordHelp] = useState(true);
    const [showConfirmPasswordHelp, setShowConfirmPasswordHelp] = useState(true);
    const [showTermsHelp, setShowTermsHelp] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Registration request
            const registerResponse = await api.post<GenericResponse<UserDto>>(
                '/api/v1/auth/register',
                {
                    email: values.email,
                    firstName: values.name,
                    lastName: values.surname,
                    password: values.password,
                }
            );

            console.log('Kayıt başarılı:', registerResponse.data);

            // Immediate login request after successful registration
            const loginResponse = await api.post(
                '/api/v1/auth/login',
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    withCredentials: true,
                }
            );

            // Log the cookies from response headers
            console.log(
                'Set-Cookie headers:',
                loginResponse.headers['set-cookie']
            );

            // Wait a bit longer to ensure cookie processing
            await new Promise((resolve) => setTimeout(resolve, 500));

            console.log('Giriş başarılı:', loginResponse.data);
            setEmail(values.email);
            setShowVerification(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    'İşlem hatası:',
                    error.response?.data || error.message
                );
                // Log more details about the error
                console.error('Response headers:', error.response?.headers);
                console.error('Status:', error.response?.status);
            } else {
                console.error('İşlem hatası:', error);
            }
        }
    }

    return (
        <>
            <Dialog open={isOpen && !showVerification} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold">
                            Kaydolun
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ad</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Adınız"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setShowNameHelp(e.target.value === '');
                                                }}
                                            />
                                        </FormControl>
                                        {showNameHelp && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Ad en az 2 karakter olmalıdır.
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Soyad</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Soyadınız"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setShowSurnameHelp(e.target.value === '');
                                                }}
                                            />
                                        </FormControl>
                                        {showSurnameHelp && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Soyad en az 2 karakter olmalıdır.
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-posta</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="E-mail"
                                                {...field}
                                                type="email"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setShowEmailHelp(e.target.value === '');
                                                }}
                                            />
                                        </FormControl>
                                        {showEmailHelp && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Geçerli bir e-posta adresi girilmelidir.(örn: ad.soyad@domain.com)
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şifre</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Şifreniz"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setShowPasswordHelp(e.target.value === '');
                                                }}
                                            />
                                        </FormControl>
                                        {showPasswordHelp && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Şifre en az 12 karakter olmalıdır ayrıca en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şifre(Tekrar)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Şifreniz"
                                                type="password"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setShowConfirmPasswordHelp(e.target.value === '');
                                                }}
                                            />
                                        </FormControl>
                                        {showConfirmPasswordHelp && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Yukarıda girdilen şifrenin aynısını tekrar girilmelidir.
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked);
                                                    setShowTermsHelp(!checked);
                                                }}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                DEHA'nın koşullarını, Gizlilik
                                                İlkesini ve Çerezler İlkesini
                                                kabul ediyorum.
                                            </FormLabel>
                                            {showTermsHelp && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Devam etmek için koşullar kabul edilmelidir.
                                                </div>
                                            )}
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Kayıt ol
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <VerificationDialog
                isOpen={showVerification}
                onClose={() => {
                    setShowVerification(false);
                    onClose();
                }}
                email={email}
                onVerificationComplete={() => {
                    setShowVerification(false);
                    onClose();
                }}
            />
        </>
    );
}
