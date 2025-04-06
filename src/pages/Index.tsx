
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard
      navigate(isAdmin ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Redirecting...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default Index;
