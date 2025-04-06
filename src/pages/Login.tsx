
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // For testing purposes, allow quick login
  const adminCredentials = { email: "admin@healthcompass.com", password: "password" };
  const userCredentials = { email: "user@example.com", password: "password" };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Navigate to appropriate dashboard
        const isAdmin = email.includes("admin");
        navigate(isAdmin ? "/admin" : "/");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-health-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block h-12 w-12 rounded-full bg-health-blue-700 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">HC</span>
          </div>
          <h1 className="text-3xl font-bold text-health-blue-800">Health Compass</h1>
          <p className="text-health-blue-600">Intelligent health plan recommendations</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-health-blue-600 hover:bg-health-blue-700"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="flex flex-col gap-2 w-full pt-2">
                <div className="text-sm text-center text-muted-foreground mb-1">
                  Quick access (for demo):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEmail(adminCredentials.email);
                      setPassword(adminCredentials.password);
                    }}
                  >
                    Admin
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEmail(userCredentials.email);
                      setPassword(userCredentials.password);
                    }}
                  >
                    User
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
