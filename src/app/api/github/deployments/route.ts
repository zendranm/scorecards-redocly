import { NextRequest, NextResponse } from "next/server";
import { fetchDeployments } from "@/lib/fetchDeployments";

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
if (!owner || !repo) {
  throw new Error("GITHUB_OWNER and GITHUB_REPO must be set");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerParam = searchParams.get("owner") || owner;
    const repoParam = searchParams.get("repo") || repo;

    const deployments = await fetchDeployments(
      ownerParam as string,
      repoParam as string
    );

    return NextResponse.json({
      success: true,
      data: deployments,
      count: deployments.length,
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
}
