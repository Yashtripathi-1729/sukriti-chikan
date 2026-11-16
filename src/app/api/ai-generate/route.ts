import { NextRequest, NextResponse } from "next/server";
import { generateProductDetails } from "@/lib/gemini";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { image, mimeType } = await req.json();

  try {
    const details = await generateProductDetails(image, mimeType);
    return NextResponse.json(details);
  } catch (error) {
    console.error("AI generation failed:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
