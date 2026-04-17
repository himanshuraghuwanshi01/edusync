"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MatchCard } from "@/components/match-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  subjects?: any[];
  availability?: any[];
}

interface Match {
  id: string;
  name: string;
  email: string;
  subjects?: any[];
  availability?: any[];
  bio?: string;
  match_score?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch complete user profile and matches
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        const profileRes = await fetch(`${apiUrl}/users/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const fullProfile = await profileRes.json();
          setUser(fullProfile);
        }

        // Fetch matches
        const matchesRes = await fetch(`${apiUrl}/matches/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          setMatches(matchesData || []);
        } else if (matchesRes.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        const errorMsg = err instanceof Error ? err.message : "Failed to load dashboard";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleRefresh = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const matchesRes = await fetch(`${apiUrl}/matches/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData || []);
      }
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showAuth isLoggedIn={false} />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar showAuth isLoggedIn />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-muted-foreground">Welcome back,</h2>
          <h1 className="text-3xl font-bold">{user.name} 🎉</h1>
        </div>

        {/* Your Profile Summary */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.subjects?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Topics you study</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.availability?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Time slots</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.bio ? "✓" : "!"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.bio ? "Complete" : "Add a bio"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Matches Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Study Partner Matches</h2>
            <p className="text-muted-foreground">Find students who match your learning style and schedule</p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="gap-2 shadow-sm"
          >
            <TrendingUp className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Finding matches..." : "Refresh Matches"}
          </Button>
        </div>

        {/* Matches Count Card */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Partners</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on your profile</p>
            </CardContent>
          </Card>
        </div>

        {/* Matches List */}
        {matches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard 
                key={match.id} 
                id={match.id}
                name={match.name}
                subjects={match.subjects?.map((s: any) => s.name || s) || []}
                matchScore={Math.round((match.match_score || 0.85) * 100)}
                availability={match.availability?.[0]?.day || "Flexible"}
                bio={match.bio}
              />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center border-dashed border-2 py-20 text-center bg-muted/20">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold">No matches found yet</h3>
            <p className="mb-8 max-w-sm text-muted-foreground">
              Try updating your profile with more subjects, availability, and a detailed bio to help our AI find the best study partners for you.
            </p>
            <Link href="/profile">
              <Button size="lg" className="px-8 shadow-md">Update Profile</Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
}
