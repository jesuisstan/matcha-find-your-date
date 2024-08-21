import { ReactNode } from 'react';

import { z } from 'zod';

// Define the schema for radio option
const radioOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// Define the schema for RadioGroup props
export const radioGroupPropsSchema = z.object({
  label: z.string().optional(),
  options: z.array(radioOptionSchema),
  defaultValue: z.string().optional(),
  selectedItem: z.string().optional(),
  onSelectItem: z.function(z.tuple([z.string()]), z.void()),
});

// Define the type for RadioGroup props based on the schema
export type TRadioGroupProps = z.infer<typeof radioGroupPropsSchema>;

// Define the schema for RadioOption props
export const radioOptionPropsSchema = z.object({
  value: z.string(),
  isSelected: z.boolean(),
  onSelect: z.function(z.tuple([z.string()]), z.void()),
  children: z.custom<ReactNode>(),
});

// Define the type for RadioOption props based on the schema
export type TRadioOptionProps = z.infer<typeof radioOptionPropsSchema>;
