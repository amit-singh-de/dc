import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  resetPassword,
  verifyResetCode,
  resetPasswordWithCode,
} from "../lib/auth";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface ForgotPasswordModalProps {
  open?: boolean;
  onClose?: () => void;
}

const ForgotPasswordModal = ({
  open = false,
  onClose = () => {},
}: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password" | "success">(
    "email",
  );

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setStep("code");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await verifyResetCode(email, resetCode);
      setStep("password");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await resetPasswordWithCode(email, resetCode, newPassword);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setStep("email");
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleSendCode} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
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

            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </DialogFooter>
          </form>
        );

      case "code":
        return (
          <form onSubmit={handleVerifyCode} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resetCode">Verification Code</Label>
              <div className="flex gap-2 justify-between">
                {[...Array(6)].map((_, i) => (
                  <Input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="bg-background text-center text-xl font-mono w-12 h-12 p-0"
                    value={resetCode[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !/^[0-9]$/.test(value)) return;

                      const newCode = resetCode.split("");
                      newCode[i] = value;
                      setResetCode(newCode.join(""));

                      // Auto-focus next input
                      if (value && i < 5) {
                        const nextInput = document.querySelector(
                          `input[name="otp-${i + 1}"]`,
                        ) as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (e.key === "Backspace" && !resetCode[i] && i > 0) {
                        const prevInput = document.querySelector(
                          `input[name="otp-${i - 1}"]`,
                        ) as HTMLInputElement;
                        if (prevInput) {
                          prevInput.focus();
                          e.preventDefault();
                        }
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteData = e.clipboardData
                        .getData("text/plain")
                        .trim();
                      if (/^\d{6}$/.test(pasteData)) {
                        setResetCode(pasteData);
                      }
                    }}
                    name={`otp-${i}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                We've sent a verification code to {email}. Please check your
                inbox and enter the code above.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  We've sent a verification code to your email. Please check
                  your inbox and spam folder.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("email")}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </DialogFooter>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("code")}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </form>
        );

      case "success":
        return (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Password Reset Successful!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <Button className="w-full mt-4" onClick={handleClose}>
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[400px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reset Password
          </DialogTitle>
        </DialogHeader>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
