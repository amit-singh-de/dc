import { supabase, mockAuth } from "./supabase";

export const signIn = async (email: string, password: string) => {
  // For testing, accept any email/password
  if (email && password) {
    return { user: { id: "mock-user-id", email } };
  }
  throw new Error("Invalid credentials");
};

export const signOut = async () => {
  const { error } = await (supabase?.auth || mockAuth).signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};
