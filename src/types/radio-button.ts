import { ReactNode } from 'react';

import { z } from 'zod';

const radioOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const radioGroupPropsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  options: z.array(radioOptionSchema),
  defaultValue: z.string().optional(),
});

export type TRadioGroupProps = z.infer<typeof radioGroupPropsSchema>;

export const radioOptionPropsSchema = z.object({
  value: z.string(),
  isSelected: z.boolean(),
  onSelect: z.function(z.tuple([z.string()], z.void())),
  children: z.custom<ReactNode>(),
  name: z.string(),
});

export type TRadioOptionProps = z.infer<typeof radioOptionPropsSchema>;
