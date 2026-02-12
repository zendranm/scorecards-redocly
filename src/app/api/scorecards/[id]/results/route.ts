import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const latestResult = await prisma.scorecardResult.findFirst({
      where: { scorecardId: id },
      orderBy: { calculatedAt: "desc" },
      include: {
        scorecard: true,
      },
    });

    if (!latestResult) {
      return NextResponse.json(
        { success: false, error: "No results found for this scorecard" },
        { status: 404 }
      );
    }

    const result = {
      scorecardName: latestResult.scorecard.name,
      repository: latestResult.scorecard.repository,
      timeWindow: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
      passed: latestResult.passed,
      ruleResults: latestResult.ruleResults,
      calculatedAt: latestResult.calculatedAt.toISOString(),
      deploymentCount: latestResult.deploymentCount,
    };

    return NextResponse.json({
      success: true,
      data: result,
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
