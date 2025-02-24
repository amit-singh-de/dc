import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import { PlusCircle, Bell, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "../lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onAddProduct?: () => void;
}

const DashboardHeader = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onAddProduct = () => console.log("Add product clicked"),
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="w-full h-20 bg-background border-b border-border px-6 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Product Tracker
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          onClick={onAddProduct}
          className="flex items-center gap-2"
          size="lg"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Notification Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
