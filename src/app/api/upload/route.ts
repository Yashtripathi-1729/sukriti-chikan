import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, removeImages } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `products/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      // All-or-nothing: clean up what was already uploaded
      await removeImages(urls);
      return NextResponse.json(
        { error: `Photo upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    urls.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
  }

  return NextResponse.json({ urls });
}
