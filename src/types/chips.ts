import { ReactNode } from 'react';

import { z } from 'zod';

export const chipsOptionPropsSchema = z.object({
  paramName: z.string(),
  value: z.string(),
  isSelected: z.boolean(),
  onSelect: z.function(z.tuple([z.string()], z.void())),
  children: z.custom<ReactNode>(),
});

export type TChipsOptionProps = z.infer<typeof chipsOptionPropsSchema>;

const chipOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  version: z.string().optional(),
});

export const chipsGroupPropsSchema = z.object({
  smartdataFilterKey: z.string(),
  smartdataSubFilterKey: z.string().optional(),
  label: z.string(),
  options: z.array(chipOptionSchema),
  defaultValues: z.array(z.string()),
  singleSelection: z.boolean().optional(),
  showSpinner: z.boolean().optional(),
  loading: z.boolean().optional(),
  errorMessage: z.string().optional(),
  overview: z.string().optional(),
  versionLength: z.number().optional(),
});

export type TChipGroupProps = z.infer<typeof chipsGroupPropsSchema>;
