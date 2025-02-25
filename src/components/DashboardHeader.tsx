import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import { PlusCircle, Bell, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
  notifications?: Array<{
    id: string;
    productName: string;
    daysLeft: number;
  }>;
}

const DashboardHeader = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onAddProduct = () => console.log("Add product clicked"),
  notifications = [],
  setNotifications = (notifications: any) => {},
}: DashboardHeaderProps & {
  setNotifications: (notifications: any) => void;
}) => {
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <div className="px-2 py-3 border-b border-border">
                <h4 className="font-semibold">Notifications</h4>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-1 py-2">
                {!notifications || notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    No notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-2 py-3 hover:bg-muted rounded-md transition-colors"
                    >
                      <p className="text-sm font-medium">
                        {notification.productName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.daysLeft <= 0 ? (
                          <span className="text-destructive font-medium">
                            Overdue by {Math.abs(notification.daysLeft)} day
                            {Math.abs(notification.daysLeft) !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span>
                            Reorder due in {notification.daysLeft} day
                            {notification.daysLeft !== 1 ? "s" : ""}
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {notifications && notifications.length > 0 && (
                <div className="px-2 py-2 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setNotifications([])}
                  >
                    Clear all notifications
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

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
