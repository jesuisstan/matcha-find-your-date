import { z } from 'zod';

import { userSubscriptionSchema } from '@/types/user-subscription';

export const userSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  lang: z.string(),
  subscription: z.custom((value) => {
    const validationResult = userSubscriptionSchema.safeParse(value);
    if (validationResult.success) {
      return validationResult.data;
    } else {
      throw new Error(validationResult.error.message);
    }
  }),
});

export type TUser = z.infer<typeof userSchema>;
