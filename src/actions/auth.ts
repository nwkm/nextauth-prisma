'use server';

import bcryptjs from 'bcryptjs';
import {
    signInWithPasswordSchema,
    signUpWithPasswordSchema,
    type SignInWithPasswordFormInput,
    type SignUpWithPasswordFormInput,
} from '~/lib/validations/auth';
import db from '~/config/db';
import { getUserByEmail } from './user';
import { signIn } from '~/lib/auth';

type SignInActionResponse =
    | 'invalid-input'
    | 'not-registered'
    | 'invalid-credentials'
    | 'success';
export async function signInWithPassword(
    rawInput: SignInWithPasswordFormInput
): Promise<SignInActionResponse> {
    try {
        const validatedInput = signInWithPasswordSchema.safeParse(rawInput);
        if (!validatedInput.success) return 'invalid-input';

        const existingUser = await getUserByEmail({
            email: validatedInput.data.email,
        });
        if (!existingUser) return 'not-registered';

        await signIn('credentials', {
            email: validatedInput.data.email,
            password: validatedInput.data.password,
            redirect: false,
        });

        return 'success';
    } catch (error) {
        console.error(error);
        if ((error as any).type === 'CredentialsSignin') {
            return 'invalid-credentials';
        }
        throw new Error('Error signin in with password');
    }
}

type SignUpActionResponse = 'invalid-input' | 'exists' | 'error' | 'success';

export async function signUpWithPassword(
    rawInput: SignUpWithPasswordFormInput
): Promise<SignUpActionResponse> {
    try {
        const validatedInput = signUpWithPasswordSchema.safeParse(rawInput);
        if (!validatedInput.success) return 'invalid-input';

        const user = await getUserByEmail({ email: validatedInput.data.email });
        if (user) return 'exists';

        const hashedPassword = await bcryptjs.hash(
            validatedInput.data.password,
            10
        );

        const newUser = await db.user.create({
            data: {
                email: validatedInput.data.email,
                password: hashedPassword,
            },
        });
        return newUser ? 'success' : 'error';
    } catch (error) {
        console.error(error);
        throw new Error('Error signing up with password');
    }
}
