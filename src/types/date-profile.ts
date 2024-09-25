import { z } from 'zod';

export const dateProfileSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  nickname: z.string(),
  age: z.number(), 
  sex: z.enum(['male', 'female']),
  biography: z.string(),
  tags: z.array(z.string()),
  tags_in_common: z.number(), // Number of matching tags with the current user
  last_action: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  online: z.boolean(),
  raiting: z.number(),
  sex_preferences: z.enum(['men', 'women', 'bisexual']),
  photos: z.array(z.string()),
  confirmed: z.boolean(),
  complete: z.boolean(),
});

export type TDateProfile = z.infer<typeof dateProfileSchema>;
