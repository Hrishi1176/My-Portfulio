import { NextResponse } from "next/server";
import { PayloadService } from "@/services/payloadService";

export async function GET() {
  try {
    const projects = await PayloadService.getProjects();

    return NextResponse.json(
      {
        success: true,
        projects,
        totalCount: projects.length,
        source: "payload-cms",
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
        error: "Failed to fetch projects from Payload CMS",
      },
      { status: 500 }
    );
  }
}
