import { NextRequest, NextResponse } from "next/server";
import { generateProductDetails } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
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
