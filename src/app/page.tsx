import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth';
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from '~/config/defaults';
import { Header } from '~/components/customs/header';

export default async function Home() {
    const session = await auth();
    if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT);

    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>Here is home page</div>
            </main>
        </>
    );
}
