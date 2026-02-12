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
  durationHours: z.number(),
  type: z.enum(["rolling", "fixed"]),
});

const ScorecardSchema = z.object({
  name: z.string(),
  repository: z.string(),
  timeWindow: TimeWindowSchema,
  rules: z.array(RuleSchema),
});

const ScorecardsFileSchema = z.object({
  scorecards: z.array(ScorecardSchema),
});

export const parseScorecards = (yamlContent: string): Scorecard[] => {
  const parsed = yaml.load(yamlContent);
  const validated = ScorecardsFileSchema.parse(parsed);
  return validated.scorecards;
};

export const loadScorecards = (): Scorecard[] => {
  const scorecardDir = join(process.cwd(), "scorecards");

  try {
    const files = readdirSync(scorecardDir).filter(
      (file) => file.endsWith(".yaml") || file.endsWith(".yml")
    );

    const allScorecards: Scorecard[] = [];

    for (const file of files) {
      const content = readFileSync(join(scorecardDir, file), "utf-8");
      const scorecards = parseScorecards(content);
      allScorecards.push(...scorecards);
    }

    return allScorecards;
  } catch (error) {
    return [];
  }
};
