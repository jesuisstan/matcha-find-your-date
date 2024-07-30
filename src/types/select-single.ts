import { z } from 'zod';

const SelectSingleOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const SelectSinglePropsSchema = z.object({
  smartdataFilterKey: z.string(),
  smartdataSubFilterKey: z.string().optional(),
  label: z.string().optional(),
  options: z.array(SelectSingleOptionSchema),
  defaultValue: z.string(),
  loading: z.boolean().optional(),
});

export type TSelectSingleProps = z.infer<typeof SelectSinglePropsSchema>;
