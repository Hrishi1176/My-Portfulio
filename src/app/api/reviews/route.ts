import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, reviews: [], error: "Database error fetching reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientRole, company, rating, reviewText } = body;

    if (!clientName || !reviewText) {
      return NextResponse.json(
        { error: "Client Name and Review Text are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection("reviews");

    const newReview = {
      clientName: clientName.trim(),
      clientRole: clientRole ? clientRole.trim() : "Client",
      company: company ? company.trim() : "",
      rating: Number(rating) || 5,
      reviewText: reviewText.trim(),
      createdAt: new Date(),
      isVerified: true,
    };

    const result = await collection.insertOne(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review has been published.",
        review: { ...newReview, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please check database connection." },
      { status: 500 }
    );
  }
}
