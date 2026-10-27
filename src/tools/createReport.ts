import { z } from 'zod';
import { openPullRequest } from '../clients/deployApi.js';

const inputSchema = {
  name: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string(),
  data_source: z.enum(['sql', 'cube']).default('sql'),
  query: z.string().describe('SQL text, or a JSON Cube query when data_source is cube'),
  schedule: z.string().optional().describe('Cron expression, UTC'),
};

export const createReportTool = {
  name: 'create_report',
  description: 'Scaffold a report as a Deploy Projects folder and open a pull request for it.',
  inputSchema,
  async handler(args: z.infer<z.ZodObject<typeof inputSchema>>) {
    const useCube = args.data_source === 'cube';
    const deployYaml = [
      `name: ${args.name}`,
      'type: api',
      'runtime: python3',
      useCube ? 'cube: true' : 'env:\n  BQ_PROJECT: kestrel-analytics-demo',
      'auth: true',
      args.schedule ? `schedule: "${args.schedule}"` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const mainPy = useCube
      ? [
          'from flask import Flask, jsonify',
          'from cube_client import CubeClient',
          'app = Flask(__name__)',
          '@app.route("/health")',
          'def health():\n    return "ok"',
          '@app.route("/")',
          `def report():\n    return jsonify(CubeClient().load(${args.query}))`,
        ].join('\n')
      : [
          'import os',
          'from flask import Flask, jsonify',
          'from google.cloud import bigquery',
          'app = Flask(__name__)',
          `SQL = """${args.query}"""`,
          '@app.route("/health")',
          'def health():\n    return "ok"',
          '@app.route("/")',
          'def report():\n    rows = bigquery.Client(project=os.environ["BQ_PROJECT"]).query(SQL).result()\n    return jsonify([dict(r) for r in rows])',
        ].join('\n');

    const requirements = ['flask', 'gunicorn', useCube ? 'requests' : 'google-cloud-bigquery'].join('\n');
    const { prUrl } = await openPullRequest(args.name, {
      'deploy.yaml': deployYaml,
      'main.py': mainPy,
      'requirements.txt': requirements,
    });
    return { content: [{ type: 'text' as const, text: `Report ${args.name} proposed: ${prUrl}` }] };
  },
};
