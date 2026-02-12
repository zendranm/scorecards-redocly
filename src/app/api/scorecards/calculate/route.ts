import { NextResponse } from "next/server";
import { loadScorecards } from "@/lib/yamlParser";
import { fetchDeployments } from "@/lib/fetchDeployments";
import { calculateScorecard } from "@/lib/scorecardCalculator";

export const POST = async () => {
  try {
    const scorecards = loadScorecards();

    if (scorecards.length === 0) {
      return NextResponse.json(
        { success: false, error: "No scorecards found" },
        { status: 404 }
      );
    }

    const results = await Promise.all(
      scorecards.map(async (scorecard) => {
        const [owner, repo] = scorecard.repository.split("/");
        const deployments = await fetchDeployments(owner, repo);
        return calculateScorecard(scorecard, deployments);
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
