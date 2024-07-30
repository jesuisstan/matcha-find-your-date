import { z } from 'zod';

export const seriesSchema = z.array(
  z.object({
    id: z.string(),
    color: z.string().optional(),
    name: z.string(),
    data: z.array(z.array(z.number().nullable())),
    version: z.string().optional(),
    // marker: z
    //   .object({
    //     enabled: z.boolean(),
    //     symbol: z.string().optional(),
    //     fillColor: z.string().optional(),
    //     lineColor: z.string().optional(),
    //     lineWidth: z.number().optional(),
    //     radius: z.number().optional(),
    //   })
    //   .optional(),
  })
);

export const versionCountSchema = z.array(
  z.object({
    item: z.string(),
    versionLength: z.number(),
  })
);

export const seriesSchemaWithGradient = z.array(
  z.object({
    id: z.string(),
    color: z.string().optional(),
    name: z.string(),
    data: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        color: z.string(),
      })
    ),
    version: z.string().optional(),
  })
);

// add infer typeof seriesSchema
// export type TSeries = Highcharts.SeriesOptionsType[];
export type TSeries = z.infer<typeof seriesSchema>;
