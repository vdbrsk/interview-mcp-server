import { z } from 'zod';
import { runSelect } from '../clients/warehouse.js';

export const runSqlTool = {
  name: 'run_sql',
  description: 'Run a read-only SELECT against the warehouse (datasets: staging, intermediate, marts).',
  inputSchema: {
    sql: z.string().min(1),
  },
  async handler({ sql }: { sql: string }) {
    if (!/^\s*(select|with)\b/i.test(sql)) {
      return { isError: true, content: [{ type: 'text' as const, text: 'Only SELECT statements are allowed.' }] };
    }
    const rows = await runSelect(sql);
    return { content: [{ type: 'text' as const, text: JSON.stringify(rows.slice(0, 1000)) }] };
  },
};
