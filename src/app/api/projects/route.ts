import { NextResponse } from "next/server";
import { GitHubProjectsService, getGitHubUsername } from "@/services/GitHubProjectsService";

export async function GET() {
  try {
    const projects = await GitHubProjectsService.getDynamicProjects();
    const username = getGitHubUsername();

    return NextResponse.json(
      {
        success: true,
        projects,
        totalCount: projects.length,
        username,
        lastSynced: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dynamic projects",
      },
      { status: 500 }
    );
  }
}
