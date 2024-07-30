import { z } from 'zod';

export const DataItemSchema = z
  .object({
    date: z.string(),
  })
  .catchall(z.string());

export type TDataItem = z.infer<typeof DataItemSchema>;

export const downloadSchema = z.object({
  exportName: z.string(),
  data: z.array(DataItemSchema),
});

export type TDownload = z.infer<typeof downloadSchema>;
