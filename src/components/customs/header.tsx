import Link from 'next/link';
import { auth } from '~/lib/auth';
import { cn } from '~/lib/utils';
import { buttonVariants } from '../ui/button';
import { SignOutButton } from '../customs/signout-button';

export async function Header() {
    const session = await auth();

    return (
        <nav className="space-x-1">
            {session?.user ? (
                <>
                    <div>Connected user: {session.user.email}</div>
                    <SignOutButton />
                </>
            ) : (
                <Link
                    aria-label="Get started"
                    href="/signup"
                    className={cn(buttonVariants({ size: 'sm' }), 'ml-2')}
                >
                    Sign Up
                </Link>
            )}
        </nav>
    );
}
