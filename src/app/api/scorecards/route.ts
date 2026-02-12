import { NextResponse } from "next/server";
import { loadScorecards } from "@/lib/yamlParser";

export const GET = async () => {
  try {
    const scorecards = loadScorecards();

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
