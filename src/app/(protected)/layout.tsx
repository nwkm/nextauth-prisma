import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from '~/config/defaults';

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

export default async function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    const session = await auth();
    if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT);

    return <>{children}</>;
}
