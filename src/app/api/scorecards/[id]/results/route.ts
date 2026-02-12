import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { TimeWindow } from "@/types/scorecard";

// TODO: Depending on business logic, consider throwing an error if the scorecard has no fresh results
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

    const timeWindow = latestResult.scorecard
      .timeWindow as unknown as TimeWindow;
    const calculatedAt = dayjs(latestResult.calculatedAt);

    let start: string;
    let end: string;

    if (timeWindow.type === "rolling") {
      start = calculatedAt
        .subtract(timeWindow.durationHours, "hour")
        .toISOString();
      end = calculatedAt.toISOString();
    } else {
      start = calculatedAt.startOf("day").toISOString();
      end = calculatedAt.toISOString();
    }

    const result = {
      scorecardName: latestResult.scorecard.name,
      repository: latestResult.scorecard.repository,
      timeWindow: {
        start,
        end,
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
