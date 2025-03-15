import { supabase } from "./supabase";
import { User, Provider } from "@supabase/supabase-js";

// ✅ Sign up with email and password
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }

  return data;
};

// ✅ Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

// ✅ Sign in with email OTP
export const signInWithOtp = async (email: string) => {
  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://your-production-url.com/reset-password" // Production URL
      : "http://localhost:5173/reset-password"; // Localhost URL

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectUrl },
  });

  if (error) {
    throw new Error("Failed to send OTP. Please try again.");
  }

  return { success: true, message: "OTP sent to email." };
};

// ✅ Sign in with OAuth provider (e.g., Google, GitHub, etc.)
export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });

  if (error) {
    throw error;
  }

  return data;
};

// ✅ Update password after OTP confirmation (on reset password page)
export const updatePassword = async (newPassword: string) => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    throw new Error("Session expired. Please request a new OTP.");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    throw error;
  }

  return { success: true, message: "Password updated successfully." };
};

// ✅ Sign out the user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// ✅ Get the current authenticated user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};
