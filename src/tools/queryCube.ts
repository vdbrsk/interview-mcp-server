import { z } from 'zod';
import { cubeLoad } from '../clients/cube.js';

export const queryCubeTool = {
  name: 'query_cube',
  description:
    'Run a structured query against the semantic layer. Members are written view.member, ' +
    'for example revenue.revenue or bookings_overview.demo_show_up_rate.',
  inputSchema: {
    measures: z.array(z.string()).optional(),
    dimensions: z.array(z.string()).optional(),
    timeDimensions: z
      .array(
        z.object({
          dimension: z.string(),
          granularity: z.string().optional(),
          dateRange: z.union([z.string(), z.array(z.string())]).optional(),
        }),
      )
      .optional(),
    filters: z
      .array(z.object({ member: z.string(), operator: z.string(), values: z.array(z.string()).optional() }))
      .optional(),
    limit: z.number().int().positive().max(1000).optional(),
  },
  async handler(args: Record<string, unknown>) {
    const rows = await cubeLoad(args);
    return { content: [{ type: 'text' as const, text: JSON.stringify(rows) }] };
  },
};
