import dayjs from "dayjs";
import { Scorecard, ScorecardResult, RuleResult } from "@/types/scorecard";
import { DeploymentEvent } from "@/types/deployment";
import { calculateTimeWindow, isWithinTimeWindow } from "@/lib/timeWindow";

export const calculateScorecard = (
  scorecard: Scorecard,
  deployments: DeploymentEvent[]
): ScorecardResult => {
  const { start, end } = calculateTimeWindow(scorecard.timeWindow);

  const filteredDeployments = deployments.filter((d) =>
    isWithinTimeWindow(d.timestamp, start, end)
  );

  const successfulCount = filteredDeployments.filter(
    (d) => d.status === "success"
  ).length;
  const failedCount = filteredDeployments.filter(
    (d) => d.status === "failure"
  ).length;

  const ruleResults: RuleResult[] = scorecard.rules.map((rule) => {
    let actual = 0;
    let passed = false;

    if (rule.type === "min_successful") {
      actual = successfulCount;
      passed = actual >= rule.threshold;
    } else if (rule.type === "max_failed") {
      actual = failedCount;
      passed = actual <= rule.threshold;
    }

    return {
      ruleId: rule.id,
      passed,
      actual,
      threshold: rule.threshold,
      message: passed
        ? `✓ ${rule.description} (${actual}/${rule.threshold})`
        : `✗ ${rule.description} (${actual}/${rule.threshold})`,
    };
  });

  return {
    scorecardName: scorecard.name,
    repository: scorecard.repository,
    timeWindow: {
      start: dayjs(start).toISOString(),
      end: dayjs(end).toISOString(),
    },
    passed: ruleResults.every((r) => r.passed),
    ruleResults,
    calculatedAt: dayjs().toISOString(),
    deploymentCount: filteredDeployments.length,
  };
};
