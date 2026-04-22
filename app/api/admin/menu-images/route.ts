import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function isAuthed(req: NextRequest) {
  return req.headers.get("authorization") === process.env.ADMIN_SECRET;
}

// GET — fetch all menu images
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const { data, error } = await supabase.from("menu_images").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

// POST — upload new image for a menu item
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const slug = formData.get("slug") as string;

  if (!file || !slug) {
    return NextResponse.json(
      { error: "Missing file or slug" },
      { status: 400 },
    );
  }

  // Validate format
  const allowed = ["image/webp", "image/avif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Only .webp and .avif formats are allowed" },
      { status: 400 },
    );
  }

  const ext = file.type === "image/webp" ? "webp" : "avif";
  const fileName = `${slug}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("menu-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(fileName);

  const url = urlData.publicUrl;

  // Upsert into menu_images table
  const { error: dbError } = await supabase
    .from("menu_images")
    .upsert(
      { slug, url, updated_at: new Date().toISOString() },
      { onConflict: "slug" },
    );

  if (dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ success: true, url });
}

// DELETE — remove image for a menu item
export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const { slug } = await req.json();
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  // Find the image to get filename
  const { data } = await supabase
    .from("menu_images")
    .select("url")
    .eq("slug", slug)
    .single();

  if (data?.url) {
    const fileName = data.url.split("/").pop();
    await supabase.storage.from("menu-images").remove([fileName!]);
  }

  // Delete from table
  await supabase.from("menu_images").delete().eq("slug", slug);

  return NextResponse.json({ success: true });
}
