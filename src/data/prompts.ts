import { supabase } from "@/src/lib/supabase";

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  summary?: string;
  categories: string[];
  author: string;
  date: string;
  images: string[];
  featured?: boolean;
}

export const CATEGORIES = [
  "Tümü",
  "Profil / Avatar",
  "Poster / El İlanı"
];

// Fallback for types if needed, but mainly we use the fetcher now
export const PROMPTS: Prompt[] = [];

export async function getAllPrompts(): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from('banana_prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }

  return data as Prompt[];
}
