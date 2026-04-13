import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

// Verify admin token
async function verifyAdmin(token: string | null): Promise<boolean> {
  if (!token) return false;
  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", token)
    .single();
  return !!data;
}

// List all gallery images
export async function GET(request: Request) {
  const token = request.headers.get("authorization");
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({ images });
}

// Upload images
export async function POST(request: Request) {
  const token = request.headers.get("authorization");
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const results = [];

  for (const file of files) {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;

    const { error } = await supabase.storage
      .from("gallery")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      results.push({ name: file.name, success: false, error: error.message });
    } else {
      results.push({ name: file.name, success: true, fileName });
    }
  }

  return NextResponse.json({ results });
}

// Delete an image
export async function DELETE(request: Request) {
  const token = request.headers.get("authorization");
  if (!(await verifyAdmin(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName } = await request.json();

  if (!fileName) {
    return NextResponse.json(
      { error: "No fileName provided" },
      { status: 400 },
    );
  }

  const { error } = await supabase.storage.from("gallery").remove([fileName]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
