import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const BUCKET = "product-images";

// Delete images from storage, given their public URLs
export async function removeImages(urls: string[]) {
  const paths = urls
    .map((u) => u.split(`/${BUCKET}/`)[1])
    .filter((p): p is string => !!p);
  if (paths.length === 0) return;
  const { error } = await getSupabaseAdmin().storage.from(BUCKET).remove(paths);
  if (error) console.error("Image cleanup failed:", error);
}

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  fabric: string;
  work_type: string;
  price: number;
  images: string[];
  tags: string[];
  is_published: boolean;
  created_at: string;
};
