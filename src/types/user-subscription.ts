import { z } from 'zod';

import { TSmartdataIdentity } from '@/types/smartdata-identity';

// Custom validator for the `key` property
const keyValidator = (input: unknown): input is TSmartdataIdentity[] => {
  if (!Array.isArray(input)) return false;
  for (const item of input) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.id !== 'number' ||
      typeof item.name !== 'string' ||
      typeof item.link !== 'string' ||
      typeof item.available !== 'boolean'
    ) {
      return false;
    }
  }
  return true;
};

export const userSubscriptionSchema = z.object({
  key: z.custom(keyValidator),
});

export type TUserSubscription = z.infer<typeof userSubscriptionSchema>;
