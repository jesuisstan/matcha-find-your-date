import { z } from 'zod';

const SelectSingleOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const SelectSinglePropsSchema = z.object({
  label: z.string().optional(),
  options: z.array(SelectSingleOptionSchema),
  defaultValue: z.string(),
  selectedItem: z.string(),
  setSelectedItem: z.function(z.tuple([z.string()]), z.void()),
  loading: z.boolean().optional(),
});

export type TSelectSingleProps = z.infer<typeof SelectSinglePropsSchema>;
