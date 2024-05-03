import { emailSchema } from '~/lib/validations/email';
import { z } from 'zod';

export const getUserByEmailSchema = z.object({
    email: emailSchema,
});

export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>;
