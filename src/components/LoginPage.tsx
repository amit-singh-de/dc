import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, signInWithProvider } from "../lib/auth";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Facebook, Github, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };

    checkSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithProvider(provider);
      // The redirect will happen automatically
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      setError("");
      // Switch to sign in tab after successful registration
      document.getElementById("sign-in-tab")?.click();
      setError(
        "Registration successful! Please check your email to confirm your account.",
      );
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex justify-center mb-8">
          <img src="/logo.svg" alt="ReStock Logo" className="w-20 h-20" />
        </div>

        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger id="sign-in-tab" value="sign-in">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.545 6.558a9.42 9.42 0 0 0-.139-1.626h-7.35v3.07h4.201a3.6 3.6 0 0 1-1.558 2.356v1.96h2.525c1.476-1.36 2.32-3.36 2.32-5.76z"
                      fill="#4285F4"
                    />
                    <path
                      d="M8.057 15.999c2.11 0 3.885-.706 5.18-1.91l-2.525-1.96c-.7.47-1.596.75-2.655.75-2.044 0-3.775-1.38-4.396-3.24H1.05v2.02a7.942 7.942 0 0 0 7.007 4.34z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.66 9.64c-.156-.47-.245-.97-.245-1.49s.089-1.02.245-1.49V4.64H1.05A7.957 7.957 0 0 0 0 8.15c0 1.29.31 2.51.86 3.59l2.8-2.1z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M8.057 3.17c1.15 0 2.185.395 3 1.17l2.24-2.24C11.93.775 10.16 0 8.057 0a7.942 7.942 0 0 0-7.007 4.34l2.61 2.02c.62-1.86 2.35-3.24 4.396-3.24z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignIn("facebook")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                  Facebook
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.545 6.558a9.42 9.42 0 0 0-.139-1.626h-7.35v3.07h4.201a3.6 3.6 0 0 1-1.558 2.356v1.96h2.525c1.476-1.36 2.32-3.36 2.32-5.76z"
                      fill="#4285F4"
                    />
                    <path
                      d="M8.057 15.999c2.11 0 3.885-.706 5.18-1.91l-2.525-1.96c-.7.47-1.596.75-2.655.75-2.044 0-3.775-1.38-4.396-3.24H1.05v2.02a7.942 7.942 0 0 0 7.007 4.34z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.66 9.64c-.156-.47-.245-.97-.245-1.49s.089-1.02.245-1.49V4.64H1.05A7.957 7.957 0 0 0 0 8.15c0 1.29.31 2.51.86 3.59l2.8-2.1z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M8.057 3.17c1.15 0 2.185.395 3 1.17l2.24-2.24C11.93.775 10.16 0 8.057 0a7.942 7.942 0 0 0-7.007 4.34l2.61 2.02c.62-1.86 2.35-3.24 4.396-3.24z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignIn("facebook")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                  Facebook
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
