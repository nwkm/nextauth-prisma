import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';
import { DEFAULT_SIGNIN_REDIRECT } from '~/config/defaults';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import { SignInWithPasswordForm } from '~/components/forms/signin-with-password-form';
import { Icons } from '~/components/icons';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
    title: 'Sign In',
    description: 'Sign in to your account',
};

type SignInProp = {
    params: object;
    searchParams: {
        callbackUrl: string;
        error: string;
    };
};

export default async function SignIn({ searchParams }: SignInProp) {
    const session = await auth();
    if (session) {
        return redirect(searchParams.callbackUrl || DEFAULT_SIGNIN_REDIRECT);
    }

    return (
        <div className="flex h-auto min-h-screen w-full items-center justify-center">
            <Card className="max-sm:flex  max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Sign in</CardTitle>
                        <Link href="/">
                            <Icons.close className="size-4" />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
                    <SignInWithPasswordForm />
                </CardContent>

                <CardFooter className="grid w-full text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
                    <div>
                        <span>Don&apos;t have an account? </span>
                        <Link
                            aria-label="Sign up"
                            href="/signup"
                            className="font-bold tracking-wide text-primary underline-offset-4 transition-colors hover:underline"
                        >
                            Sign up
                            <span className="sr-only">Sign up</span>
                        </Link>
                        .
                    </div>
                    <div>
                        <span>Forgot your password? </span>
                        <Link
                            aria-label="Reset password"
                            href="/signin/password-reset"
                            className="text-sm font-normal text-primary underline-offset-4 transition-colors hover:underline"
                        >
                            Reset now
                            <span className="sr-only">Reset Password</span>
                        </Link>
                        .
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
