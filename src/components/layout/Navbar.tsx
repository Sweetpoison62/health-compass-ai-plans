
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useHealthData } from "@/context/HealthDataContext";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery } = useHealthData();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-health-blue-700">
            Health Compass
            <span className="text-health-teal-500 ml-1">AI</span>
          </h2>
        </div>
        
        <div className="flex-1 mx-12">
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans, medicines, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">
                {isAdmin ? "Administrator" : "User"}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
