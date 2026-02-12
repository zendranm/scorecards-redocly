import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchDeployments } from "@/lib/fetchDeployments";
import { calculateScorecard } from "@/lib/scorecardCalculator";
import { Rule, Scorecard, TimeWindow } from "@/types/scorecard";
import { InputJsonValue } from "@prisma/client/runtime/library";

// TODO: Scorecard calculation should be triggered by a webhook from GitHub or by a Cron job
export const POST = async () => {
  try {
    const scorecards = await prisma.scorecard.findMany({
      where: { active: true },
    });

    if (scorecards.length === 0) {
      return NextResponse.json(
        { success: false, error: "No active scorecards found" },
        { status: 404 }
      );
    }

    const results = await Promise.all(
      scorecards.map(async (dbScorecard) => {
        const scorecard: Scorecard = {
          name: dbScorecard.name,
          repository: dbScorecard.repository,
          timeWindow: dbScorecard.timeWindow as unknown as TimeWindow,
          rules: dbScorecard.rules as unknown as Rule[],
        };

        const [owner, repo] = scorecard.repository.split("/");
        const deployments = await fetchDeployments(owner, repo);
        const result = calculateScorecard(scorecard, deployments);

        await prisma.scorecardResult.create({
          data: {
            scorecardId: dbScorecard.id,
            passed: result.passed,
            ruleResults: result.ruleResults as unknown as InputJsonValue,
            deploymentCount: result.deploymentCount,
          },
        });

        return result;
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
