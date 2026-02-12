import * as yaml from "js-yaml";
import { z } from "zod";
import { Scorecard } from "@/types/scorecard";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const RuleSchema = z.object({
  id: z.string(),
  type: z.enum(["min_successful", "max_failed"]),
  threshold: z.number(),
  description: z.string(),
});

const TimeWindowSchema = z.object({
  duration: z.number(),
  type: z.enum(["rolling", "fixed"]),
});

const ScorecardSchema = z.object({
  name: z.string(),
  repository: z.string(),
  timeWindow: TimeWindowSchema,
  rules: z.array(RuleSchema),
});

export const parseScorecard = (yamlContent: string): Scorecard => {
  const parsed = yaml.load(yamlContent);
  return ScorecardSchema.parse(parsed);
};

export const loadScorecards = (): Scorecard[] => {
  const scorecardDir = join(process.cwd(), "scorecards");

  try {
    const files = readdirSync(scorecardDir).filter(
      (file) => file.endsWith(".yaml") || file.endsWith(".yml")
    );

    return files.map((file) => {
      const content = readFileSync(join(scorecardDir, file), "utf-8");
      return parseScorecard(content);
    });
  } catch (error) {
    return [];
  }
};
