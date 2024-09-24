import { z } from 'zod';

export const TSelectSingleOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
});

export const SelectSinglePropsSchema = z.object({
  label: z.string().optional(),
  options: z.array(TSelectSingleOptionSchema),
  defaultValue: z.string(),
  selectedItem: z.string(),
  setSelectedItem: z.function(z.tuple([z.string()]), z.void()),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export type TSelectSingleProps = z.infer<typeof SelectSinglePropsSchema>;
