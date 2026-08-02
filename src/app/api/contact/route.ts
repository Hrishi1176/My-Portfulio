import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendThankYouEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, requirements, budget } = body;

    // Validation
    if (!name || !email || !requirements) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Email, Requirements)." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject ? subject.trim() : "General Inquiry";
    const trimmedRequirements = requirements.trim();
    const selectedBudget = budget || "Flexible";

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection("contacts");

    // Insert submission into MongoDB
    const result = await collection.insertOne({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      requirements: trimmedRequirements,
      budget: selectedBudget,
      createdAt: new Date(),
      status: "new",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Send thank you confirmation email to the user
    await sendThankYouEmail({
      toEmail: trimmedEmail,
      userName: trimmedName,
      subject: trimmedSubject,
      requirements: trimmedRequirements,
      budget: selectedBudget,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message & requirements have been successfully submitted! A confirmation email has been sent to your inbox.",
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MongoDB Contact Submission Error:", error);
    return NextResponse.json(
      {
        error:
          "Unable to store inquiry in database. Please check MongoDB connection or try emailing directly.",
        details: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
