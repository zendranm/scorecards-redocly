export interface Rule {
  id: string;
  type: "min_successful" | "max_failed";
  threshold: number;
  description: string;
}

export interface TimeWindow {
  duration: number;
  type: "rolling" | "fixed";
}

export interface Scorecard {
  name: string;
  repository: string;
  timeWindow: TimeWindow;
  rules: Rule[];
}

export interface ScorecardResult {
  scorecardName: string;
  repository: string;
  timeWindow: {
    start: string;
    end: string;
  };
  passed: boolean;
  ruleResults: RuleResult[];
  calculatedAt: string;
  deploymentCount: number;
}

export interface RuleResult {
  ruleId: string;
  passed: boolean;
  actual: number;
  threshold: number;
  message: string;
}
