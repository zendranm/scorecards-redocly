import { Octokit } from "@octokit/rest";
import { DeploymentEvent } from "@/types/deployment";

const mapStatus = (
  conclusion: string | null,
  status: string
): DeploymentEvent["status"] => {
  if (status === "in_progress" || status === "queued") return "in_progress";
  if (conclusion === "success") return "success";
  if (conclusion === "cancelled" || conclusion === "skipped")
    return "cancelled";
  return "failure";
};

export const fetchDeployments = async (
  owner: string,
  repo: string
): Promise<DeploymentEvent[]> => {
  // TODO: Github token should be configured together with the owner and repo
  // TODO: Add a check to see if the github token, the owner and repo are valid
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    per_page: 100,
  });

  return data.workflow_runs.map((run) => ({
    repositoryName: `${owner}/${repo}`,
    workflowName: run.name || "Unknown",
    runId: run.id,
    status: mapStatus(run.conclusion, run.status || "completed"),
    timestamp: run.created_at,
    branch: run.head_branch || undefined,
    commit: run.head_sha || undefined,
    actor: run.actor?.login,
    htmlUrl: run.html_url,
  }));
};
