import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export async function GET() {
  const { data, error } = await supabase.storage
    .from("gallery")
    .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const images = (data || [])
    .filter(
      (file) =>
        !file.name.startsWith(".") && file.name !== ".emptyFolderPlaceholder",
    )
    .map((file) => ({
      name: file.name,
      url: `${supabaseUrl}/storage/v1/object/public/gallery/${file.name}`,
      created_at: file.created_at,
    }));

  return NextResponse.json(
    { images },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
