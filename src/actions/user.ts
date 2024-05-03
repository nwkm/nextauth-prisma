'use server';

import {
    getUserByEmailSchema,
    type GetUserByEmailInput,
} from '~/lib/validations/user';
import { type User } from '@prisma/client';

import db from '~/config/db';

export async function getUserByEmail(
    rawInput: GetUserByEmailInput
): Promise<User | null> {
    try {
        const validatedInput = getUserByEmailSchema.safeParse(rawInput);
        if (!validatedInput.success) return null;
        return await db.user.findUnique({
            where: {
                email: validatedInput.data.email,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error getting user by email');
    }
}
