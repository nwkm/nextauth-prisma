'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function Providers({
    // session,
    children,
}: {
    // session: Session | null;
    children: ReactNode;
}) {
    return (
        <SessionProvider refetchInterval={4 * 60}>{children}</SessionProvider>
    );
}
