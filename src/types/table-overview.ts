import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  unit: z.string(),
  value: z.number().nullable(),
  version: z.string().nullable().optional(),
});

// export type TItem = z.infer<typeof itemSchema>;

export const dataItemSchema = z.array(itemSchema);

export type TDataItem = z.infer<typeof dataItemSchema>;

export const unitTypeSchema = z.object({
  name: z.string(),
  value: z.number(),
});

// export type TUnitType = z.infer<typeof unitTypeSchema>;

export const rowItemSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    unit: z.array(unitTypeSchema),
    version: z.string().nullable().optional(),
  })
);
export type TRowItem = z.infer<typeof rowItemSchema>;
