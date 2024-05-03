import NextAuth from 'next-auth';
import bcryptjs from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialProvider from 'next-auth/providers/credentials';
import prisma from '~/config/db';
import { signInWithPasswordSchema } from './validations/auth';
import { getUserByEmail } from '~/actions/user';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@gmail.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(rawCredentials) {
                const validatedCredentials =
                    signInWithPasswordSchema.safeParse(rawCredentials);

                if (validatedCredentials.success) {
                    const user = await getUserByEmail({
                        email: validatedCredentials.data.email,
                    });
                    if (!user || !user.password) {
                        return null;
                    }
                    const passwordIsValid = await bcryptjs.compare(
                        validatedCredentials.data.password,
                        user.password
                    );

                    if (passwordIsValid) {
                        return user;
                    }
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 30,
    },
    callbacks: {
        async signIn({ account }) {
            if (account?.provider === 'credentials') return true;
            return false;
        },
        async session({ session, user }) {
            if (user) {
                session.user = user;
            }
            return await session;
        },
        async jwt({ token, user }) {
            const isSignedIn = user ? true : false;

            if (isSignedIn && user.id) {
                token.accessToken =
                    user.id.toString() + '-' + user.email + '-' + user.name;
            }

            return await token;
        },
    },
});
