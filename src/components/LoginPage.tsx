import React from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/auth";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const passkey = (form.elements.namedItem("passkey") as HTMLInputElement)
      .value;

    try {
      await signIn(username, passkey);
      navigate("/");
    } catch (err) {
      setError("Invalid username or passkey");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            src="https://api.dicebear.com/7.x/shapes/svg?seed=logo"
            alt="Logo"
            className="w-16 h-16"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passkey">Passkey</Label>
            <Input
              id="passkey"
              type="password"
              placeholder="Enter your passkey"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
