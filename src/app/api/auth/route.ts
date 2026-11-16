import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

// POST — verify admin password
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  return NextResponse.json({ success: true });
}
