import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct for Vite
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
import { signInWithOtp } from "../lib/auth";
import { supabase } from "../lib/supabase"; // ✅ Import Supabase client
import { CheckCircle } from "lucide-react";

interface ForgotPasswordModalProps {
  open?: boolean;
  onClose?: () => void;
}

const ForgotPasswordModal = ({
  open = false,
  onClose = () => {},
}: ForgotPasswordModalProps) => {
  const navigate = useNavigate(); // ✅ Vite-compatible navigation
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");

  // Step 1: Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithOtp(email);
      setStep("otp"); // Move to OTP entry step
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      // ✅ Use React Router navigation instead of Next.js router.push
      navigate("/reset-password");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setError("");
    setStep("email");
    onClose();
  };

  const renderStep = () => {
    if (step === "email") {
      return (
        <form onSubmit={handleSendOtp} className="space-y-4 py-4">
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-sm text-muted-foreground">
            Enter your email, and we’ll send you a one-time password (OTP) to
            sign in and reset your password.
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
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </DialogFooter>
        </form>
      );
    }

    if (step === "otp") {
      return (
        <form onSubmit={handleVerifyOtp} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              required
              className="bg-background"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-sm text-muted-foreground">
            Please enter the OTP sent to <strong>{email}</strong>.
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
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </DialogFooter>
        </form>
      );
    }

    return (
      <div className="py-6 space-y-4 text-center">
        <div className="flex items-center gap-2 text-green-600 justify-center">
          <CheckCircle className="h-5 w-5" />
          <p className="font-medium">OTP Verified!</p>
        </div>
        <p className="text-sm text-muted-foreground">
          You have been successfully authenticated. Redirecting to reset
          password...
        </p>
      </div>
    );
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
