import { NextResponse } from "next/server";
import { loadScorecards } from "@/lib/yamlParser";
import { prisma } from "@/lib/prisma";
import { InputJsonValue } from "@prisma/client/runtime/library";

export const POST = async () => {
  try {
    const yamlScorecards = loadScorecards();

    if (yamlScorecards.length === 0) {
      return NextResponse.json(
        { success: false, error: "No YAML scorecards found" },
        { status: 404 }
      );
    }
    const results = await Promise.all(
      yamlScorecards.map(async (scorecard) => {
        const baseName = scorecard.name;

        const activeScorecard = await prisma.scorecard.findFirst({
          where: { baseName, active: true },
        });

        if (activeScorecard) {
          const areRulesChanged =
            JSON.stringify(activeScorecard.rules) !==
            JSON.stringify(scorecard.rules);
          const isTimeWindowChanged =
            JSON.stringify(activeScorecard.timeWindow) !==
            JSON.stringify(scorecard.timeWindow);

          if (!areRulesChanged && !isTimeWindowChanged) {
            return {
              baseName,
              name: activeScorecard.name,
              version: parseInt(
                activeScorecard.name.match(/v(\d+)$/)?.[1] || "1"
              ),
              id: activeScorecard.id,
              changed: false,
            };
          }
        }

        const existingScorecards = await prisma.scorecard.findMany({
          where: { baseName },
          orderBy: { createdAt: "desc" },
        });

        let version = 1;
        if (existingScorecards.length > 0) {
          await prisma.scorecard.updateMany({
            where: { baseName, active: true },
            data: { active: false },
          });

          const lastVersion = existingScorecards[0].name.match(/v(\d+)$/);
          version = lastVersion
            ? parseInt(lastVersion[1]) + 1
            : existingScorecards.length + 1;
        }

        const versionedName = `${baseName} v${version}`;

        const created = await prisma.scorecard.create({
          data: {
            name: versionedName,
            baseName,
            active: true,
            repository: scorecard.repository,
            timeWindow: scorecard.timeWindow as unknown as InputJsonValue,
            rules: scorecard.rules as unknown as InputJsonValue,
          },
        });

        return {
          baseName,
          name: versionedName,
          version,
          id: created.id,
          changed: true,
        };
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
