// Stub for the Deploy Projects repo: reports are folders under projects/<name>/
// that land through a pull request, and scheduled ones are triggered via GET /cron.
export interface ProjectFiles {
  'deploy.yaml': string;
  'main.py': string;
  'requirements.txt': string;
}

export async function openPullRequest(name: string, files: ProjectFiles): Promise<{ prUrl: string }> {
  return { prUrl: `https://example.com/interview-deploy-projects/pull/0?project=${name}&files=${Object.keys(files).length}` };
}

export async function triggerCron(name: string): Promise<{ status: number }> {
  return { status: 200 };
}

export async function listProjects(): Promise<{ name: string; schedule?: string }[]> {
  return [
    { name: 'exec-kpi-dashboard', schedule: '0 5 * * *' },
    { name: 'daily-kpi-alerts', schedule: '10 8 * * *' },
  ];
}
