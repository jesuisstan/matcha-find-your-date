import { z } from 'zod';

export const TSelectMultiplePropsSchema = z.object({
  label: z.string().optional(),
  options: z.array(z.string()),
  defaultValues: z.array(z.string()),
  selectedItems: z.array(z.string()),
  setSelectedItems: z.function(z.tuple([z.array(z.string())], z.void())),
  loading: z.boolean().optional(),
  translator: z.string().optional(),
  avoidTranslation: z.boolean().optional(),
});

export type TSelectMultipleProps = z.infer<typeof TSelectMultiplePropsSchema>;
