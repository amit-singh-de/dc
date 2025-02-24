import { supabase } from "./supabase";

// Store the current user ID in memory
let currentUserId: string | null = null;

export const signIn = async (username: string, passkey: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("passkey", passkey)
    .single();

  if (error || !data) {
    throw new Error("Invalid passkey");
  }

  currentUserId = data.id;
  return { user: data };
};

export const signOut = async () => {
  currentUserId = null;
};

export const getCurrentUser = async () => {
  if (!currentUserId) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", currentUserId)
    .single();

  if (error || !data) {
    currentUserId = null;
    return null;
  }

  return data;
};
