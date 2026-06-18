import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BlogPost = Tables<"blog_posts">;

export const COVER_COLORS = [
  { value: "coral", label: "Koral", className: "bg-coral text-coral-foreground" },
  { value: "teal", label: "Turkus", className: "bg-teal text-teal-foreground" },
  { value: "violet", label: "Fiolet", className: "bg-violet text-violet-foreground" },
  { value: "yellow", label: "Żółć", className: "bg-yellow text-yellow-foreground" },
  { value: "ink", label: "Atrament", className: "bg-ink text-ink-foreground" },
] as const;

export function coverClass(color: string) {
  return (
    COVER_COLORS.find((c) => c.value === color)?.className ??
    "bg-coral text-coral-foreground"
  );
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadCoverImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("blog-covers")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.storage
    .from("blog-covers")
    .createSignedUrl(path, TEN_YEARS);
  if (error) throw error;
  return data.signedUrl;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPost(payload: TablesInsert<"blog_posts">) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePost(id: string, payload: TablesUpdate<"blog_posts">) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}
