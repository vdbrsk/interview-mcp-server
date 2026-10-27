import { CUBE_META } from '../clients/cube.js';

export const listMetricsTool = {
  name: 'list_metrics',
  description: 'List the Cube views with their measures and dimensions.',
  inputSchema: {},
  async handler() {
    return { content: [{ type: 'text' as const, text: JSON.stringify(CUBE_META, null, 2) }] };
  },
};
