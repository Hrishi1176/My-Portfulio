import { NextResponse } from "next/server";
import { seedPayloadDatabase } from "@/scripts/seedPayload";

export async function GET() {
  try {
    await seedPayloadDatabase();
    return NextResponse.json({
      success: true,
      message: "Payload database seeded successfully from portfolioConfig.json",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Seeding error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Seeding failed" },
      { status: 500 }
    );
  }
}
