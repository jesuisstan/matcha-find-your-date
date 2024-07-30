// import { ReactNode } from 'react';

import { z } from 'zod';

// export const SelectMultiplePropsSchema = z.object({
//   paramName: z.string(),
//   value: z.string(),
//   isSelected: z.boolean(),
//   onSelect: z.function(z.tuple([z.string()], z.void())),
//   children: z.custom<ReactNode>(),
// });
//
// export type TSelectMultipleOptionProps = z.infer<typeof SelectMultiplePropsSchema>;

const selectMultipleOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const selectMultiplePropsSchema = z.object({
  smartdataFilterKey: z.string(),
  smartdataSubFilterKey: z.string().optional(),
  label: z.string().optional(),
  title: z.string().optional(),
  subHeader: z.string().optional(),
  options: z.array(selectMultipleOptionSchema),
  defaultValues: z.array(z.string()),
  loading: z.boolean().optional(),
  firstBold: z.boolean().optional(),
  selection: z.boolean().optional(),
});

export type TSelectMultipleProps = z.infer<typeof selectMultiplePropsSchema>;
