import { ReactNode } from 'react';

import { z } from 'zod';

export const chipsOptionPropsSchema = z.object({
  paramName: z.string(),
  value: z.string(),
  isSelected: z.boolean(),
  onSelect: z.function(z.tuple([z.string()], z.void())),
  children: z.custom<ReactNode>(),
  nonClickable: z.boolean().optional(),
});

export type TChipsOptionProps = z.infer<typeof chipsOptionPropsSchema>;

export const chipsGroupPropsSchema = z.object({
  name: z.string(),
  label: z.string(),
  options: z.array(z.string()),
  selectedChips: z.array(z.string()),
  setSelectedChips: z.function(z.tuple([z.array(z.string())], z.void())),
  loading: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export type TChipGroupProps = z.infer<typeof chipsGroupPropsSchema>;
