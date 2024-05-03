'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPassword } from '~/actions/auth';
import {
    signInWithPasswordSchema,
    type SignInWithPasswordFormInput,
} from '~/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '~/components/ui/use-toast';
import { DEFAULT_SIGNIN_REDIRECT } from '~/config/defaults';
import { Button } from '~/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Icons } from '~/components/icons';
import { PasswordInput } from '~/components/customs/password-input';

export function SignInWithPasswordForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const form = useForm<SignInWithPasswordFormInput>({
        resolver: zodResolver(signInWithPasswordSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(formData: SignInWithPasswordFormInput) {
        startTransition(async () => {
            try {
                const message = await signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                switch (message) {
                    case 'not-registered':
                        toast({
                            title: 'Unknown account',
                            description:
                                'Please make sure you are signed up before signing in',
                        });
                        break;
                    case 'success':
                        toast({
                            title: 'Success!',
                            description: 'You are now signed in',
                        });
                        router.push(DEFAULT_SIGNIN_REDIRECT);
                        break;
                    default:
                        toast({
                            title: 'Error signing in with password',
                            description: 'Please try again',
                            variant: 'destructive',
                        });
                }
            } catch (error) {
                console.error('this error ', error);
                toast({
                    title: 'Something went wrong',
                    description: 'Please try again',
                    variant: 'destructive',
                });
            }
        });
    }

    return (
        <Form {...form}>
            <form
                className="grid w-full gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="johnsmith@gmail.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <Button disabled={isPending}>
                    {isPending ? (
                        <>
                            <Icons.spinner
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <span>Sign in</span>
                    )}
                    <span className="sr-only">
                        Sign in with email and password
                    </span>
                </Button>
            </form>
        </Form>
    );
}
