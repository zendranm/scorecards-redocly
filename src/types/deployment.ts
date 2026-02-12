export interface DeploymentEvent {
  repositoryName: string;
  workflowName: string;
  runId: number;
  status: "success" | "failure" | "cancelled" | "in_progress";
  timestamp: string;
  branch?: string;
  commit?: string;
  actor?: string;
  htmlUrl?: string;
}
