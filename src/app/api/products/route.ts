import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, removeImages } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

const EDITABLE_FIELDS = [
  "name",
  "description",
  "category",
  "fabric",
  "work_type",
  "price",
  "images",
  "tags",
  "colour",
  "sizes",
  "is_published",
] as const;

// Store pages are cached; refresh them whenever the catalogue changes
function refreshStore() {
  revalidatePath("/", "layout");
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// GET — list products (admin: all, public: published only); ?id= returns one
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const admin = isAdmin(req);
  const id = req.nextUrl.searchParams.get("id");

  let query = supabase.from("products").select("*");
  if (!admin) query = query.eq("is_published", true);

  if (id) {
    const { data, error } = await query.eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create product
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();

  const body = await req.json();
  const { data, error } = await getSupabaseAdmin()
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
      colour: body.colour || "",
      sizes: body.sizes || [],
      is_published: body.is_published ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  refreshStore();
  return NextResponse.json(data);
}

// PATCH — update product fields; deletes images that were removed
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  const supabase = getSupabaseAdmin();

  let removedImages: string[] = [];
  if (Array.isArray(updates.images)) {
    const { data: current } = await supabase
      .from("products")
      .select("images")
      .eq("id", body.id)
      .single();
    const kept = new Set(updates.images as string[]);
    removedImages = ((current?.images as string[]) || []).filter((u) => !kept.has(u));
  }

  const { error } = await supabase.from("products").update(updates).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await removeImages(removedImages);
  refreshStore();
  return NextResponse.json({ success: true });
}

// DELETE — remove product and its images
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();

  const { id } = await req.json();
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .delete()
    .eq("id", id)
    .select("images")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await removeImages((data?.images as string[]) || []);
  refreshStore();
  return NextResponse.json({ success: true });
}
