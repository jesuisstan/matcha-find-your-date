import { z } from 'zod';

export const smartdataIdentitySchema = z.object({
  id: z.number(),
  name: z.string(),
  link: z.string(),
  available: z.boolean(),
});

export type TSmartdataIdentity = z.infer<typeof smartdataIdentitySchema>;
