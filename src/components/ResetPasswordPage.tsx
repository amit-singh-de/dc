import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { confirmPasswordReset } from "../lib/auth";
import { AlertCircle, CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Extract token from URL
  const searchParams = new URLSearchParams(location.search);
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    if (!accessToken) {
      setError("Invalid or missing reset token");
    }
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      if (!accessToken) {
        throw new Error("Reset token is missing");
      }

      await confirmPasswordReset(accessToken, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex justify-center mb-8">
          <img src="/logo.svg" alt="ReStock Logo" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

        {success ? (
          <div className="py-6 space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <p className="font-medium">Password reset successful!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your password has been reset successfully. You will be redirected
              to the login page in a few seconds.
            </p>
            <Button className="w-full mt-4" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!accessToken ? (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>
                  Invalid or expired reset link. Please request a new password
                  reset.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="bg-background"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !accessToken}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </>
            )}

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
