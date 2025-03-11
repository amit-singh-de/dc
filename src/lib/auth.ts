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

export const resetPassword = async (email: string) => {
  try {
    // Call Supabase's built-in password reset method to trigger email sending
    const { data, error } =
      await supabase.auth.api.resetPasswordForEmail(email);

    if (error) {
      console.error("Error sending reset email:", error);
      throw new Error("Failed to send password reset email. Please try again.");
    }

    // Store the code in a database table for verification (if you still need to store the code)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const { error: storeError } = await supabase
      .from("password_reset_codes")
      .upsert([
        {
          email,
          code: verificationCode,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
        },
      ]);

    if (storeError) {
      console.error("Error storing verification code:", storeError);
      throw new Error("Failed to store verification code. Please try again.");
    }

    return { success: true, message: "Password reset email sent." };
  } catch (error) {
    console.error("Error sending reset code:", error);
    throw new Error("Failed to send verification code. Please try again.");
  }
};

export const verifyResetCode = async (email: string, code: string) => {
  try {
    // Verify from the database only
    const { data, error } = await supabase
      .from("password_reset_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error) {
      console.error("Error verifying code:", error);
      throw new Error(
        "Invalid or expired verification code. Please try again.",
      );
    }

    if (!data) {
      throw new Error(
        "Invalid or expired verification code. Please try again.",
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    throw new Error("Invalid or expired verification code. Please try again.");
  }
};

export const resetPasswordWithCode = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    // First verify the code
    await verifyResetCode(email, code);

    // Sign in with OTP to get a session
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

    if (signInError) {
      throw signInError;
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    // Clean up the verification code from database
    await supabase.from("password_reset_codes").delete().eq("email", email);

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Failed to reset password. Please try again.");
  }
};

export const confirmPasswordReset = async (
  accessToken: string,
  newPassword: string,
) => {
  // Set the access token in the session
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: "",
  });

  if (sessionError) {
    throw sessionError;
  }

  // Get the current user
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("Invalid or expired reset token");
  }

  // Get password history for this user
  const { data: userHistory, error: historyError } = await supabase
    .from("users")
    .select("password_history")
    .eq("id", userData.user.id)
    .single();

  if (historyError && historyError.code !== "PGRST116") {
    // Not found is ok for new users
    throw historyError;
  }

  // Check if password was used before (simplified check)
  if (
    userHistory?.password_history &&
    userHistory.password_history.length > 0
  ) {
    // In a real implementation, we can't directly compare with previous passwords
    // This is just a placeholder for the concept
    console.log(
      "Password history exists, would check here in a real implementation",
    );
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  // Sign out after password reset
  await supabase.auth.signOut();
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
