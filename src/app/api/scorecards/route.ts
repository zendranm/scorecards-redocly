import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const scorecards = await prisma.scorecard.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: scorecards,
      count: scorecards.length,
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
