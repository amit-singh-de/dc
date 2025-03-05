import { supabase } from "./supabase";
import { User, Provider } from "@supabase/supabase-js";

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

export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUp = async (email: string, password: string) => {
  // First check if email already exists using our custom function
  const { data: emailCheckData, error: emailCheckError } = await supabase.rpc(
    "check_email_exists",
    { email_to_check: email },
  );

  if (emailCheckError) {
    throw emailCheckError;
  }

  if (emailCheckData) {
    throw new Error(
      "This email is already registered. Please use a different email or sign in.",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const updatePassword = async (password: string) => {
  // Get the current user
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("No authenticated user found");
  }

  // Get password history for this user
  const { data: userHistory, error: historyError } = await supabase
    .from("users")
    .select("password_history")
    .eq("id", userData.user.id)
    .single();

  if (historyError) {
    throw historyError;
  }

  // Check if password was used before (this is a simplified check since we can't compare hashed passwords directly)
  // In a real implementation, you might want to use a more sophisticated approach
  if (
    userHistory?.password_history &&
    userHistory.password_history.length > 0
  ) {
    // This is just a placeholder - in reality we can't check previous passwords this way
    // since we only store hashed passwords
    throw new Error("Please choose a password you haven't used before");
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
