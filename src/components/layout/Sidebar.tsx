
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Building, FileHeart, LogOut, Pill } from "lucide-react";

export function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  
  const userNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Plans",
      href: "/plans",
      icon: FileHeart,
    },
  ];
  
  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Companies",
      href: "/admin/companies",
      icon: Building,
    },
    {
      name: "Medicines",
      href: "/admin/medicines",
      icon: Pill,
    },
    {
      name: "Plans",
      href: "/admin/plans",
      icon: FileHeart,
    },
  ];
  
  const navItems = isAdmin ? adminNavItems : userNavItems;
  
  return (
    <aside className="hidden lg:flex bg-sidebar border-r w-64 flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-full bg-health-blue-700 flex items-center justify-center">
            <span className="text-white font-bold">HC</span>
          </div>
          <span className="text-xl font-bold">Health Compass</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <div className="grid gap-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="mt-auto p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
