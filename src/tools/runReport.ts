import { z } from 'zod';
import { listProjects, triggerCron } from '../clients/deployApi.js';

export const listReportsTool = {
  name: 'list_reports',
  description: 'List deployed report projects and their schedules.',
  inputSchema: {},
  async handler() {
    return { content: [{ type: 'text' as const, text: JSON.stringify(await listProjects()) }] };
  },
};

export const runReportTool = {
  name: 'run_report',
  description: 'Trigger a deployed report now by calling its /cron endpoint.',
  inputSchema: { name: z.string() },
  async handler({ name }: { name: string }) {
    const { status } = await triggerCron(name);
    return { content: [{ type: 'text' as const, text: `${name}: /cron answered ${status}` }] };
  },
};
