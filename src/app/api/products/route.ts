import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function checkAdmin(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

// GET — list products (admin: all, public: published only)
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const isAdmin = checkAdmin(req);

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — create product
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: body.name,
      description: body.description,
      category: body.category,
      fabric: body.fabric,
      work_type: body.work_type,
      price: body.price,
      images: body.images,
      tags: body.tags || [],
      is_published: body.is_published ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH — toggle publish
export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await req.json();
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE — remove product
export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
