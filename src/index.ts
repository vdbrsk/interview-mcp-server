import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { listMetricsTool } from './tools/listMetrics.js';
import { queryCubeTool } from './tools/queryCube.js';
import { runSqlTool } from './tools/runSql.js';
import { createReportTool } from './tools/createReport.js';
import { listReportsTool, runReportTool } from './tools/runReport.js';

const server = new McpServer({ name: 'kestrel-data', version: '0.1.0' });

for (const tool of [listMetricsTool, queryCubeTool, runSqlTool, createReportTool, listReportsTool, runReportTool]) {
  server.registerTool(
    tool.name,
    { description: tool.description, inputSchema: tool.inputSchema },
    tool.handler as never,
  );
}

await server.connect(new StdioServerTransport());
