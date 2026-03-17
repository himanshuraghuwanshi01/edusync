"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Users,
  Clock,
  BookOpen,
  Award,
  Lock,
  Shield,
  Edit,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock user data
const userData = {
  name: "John Smith",
  email: "john@example.com",
  avatar: "",
  bio: "Computer Science student passionate about algorithms and machine learning. Looking for study partners who enjoy solving complex problems together.",
  subjects: [
    { name: "Computer Science", proficiency: "Advanced" },
    { name: "Mathematics", proficiency: "Intermediate" },
    { name: "Data Structures", proficiency: "Advanced" },
    { name: "Algorithms", proficiency: "Intermediate" },
  ],
  learningStyles: ["Visual", "Kinesthetic"],
  stats: {
    totalSessions: 24,
    hoursStudied: 48,
    partnersConnected: 8,
    avgRating: 4.8,
  },
}

const recentMatches = [
  { id: "1", name: "Sarah Chen", subject: "Calculus", lastSession: "2 days ago", rating: 5 },
  { id: "2", name: "Alex Rodriguez", subject: "Algorithms", lastSession: "1 week ago", rating: 4 },
  { id: "3", name: "Emily Watson", subject: "Data Structures", lastSession: "2 weeks ago", rating: 5 },
]

const recentSessions = [
  { id: "1", partner: "Sarah Chen", topic: "Chain Rule & Derivatives", date: "Mar 14, 2026", duration: "1h 30m" },
  { id: "2", partner: "Alex Rodriguez", topic: "Graph Algorithms", date: "Mar 10, 2026", duration: "2h" },
  { id: "3", partner: "Emily Watson", topic: "Binary Trees", date: "Mar 5, 2026", duration: "1h 45m" },
]

const credentials = [
  {
    id: "1",
    title: "Python Mastery",
    issuer: "EduSync",
    date: "Feb 2026",
    verified: true,
  },
  {
    id: "2",
    title: "Algorithm Fundamentals",
    issuer: "EduSync",
    date: "Jan 2026",
    verified: true,
  },
  {
    id: "3",
    title: "Data Structures Expert",
    issuer: "EduSync",
    date: "Coming Soon",
    verified: false,
  },
]

const getProficiencyColor = (level: string) => {
  switch (level) {
    case "Advanced":
      return "bg-accent/20 text-accent border-accent/30"
    case "Intermediate":
      return "bg-primary/20 text-primary border-primary/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.hoursStudied}</p>
                    <p className="text-xs text-muted-foreground">Hours</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.partnersConnected}</p>
                    <p className="text-xs text-muted-foreground">Partners</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-2xl font-bold text-primary">{userData.stats.avgRating}</p>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs (Mobile visible, Desktop sidebar) */}
            <Card className="border-border/50 lg:block">
              <CardContent className="p-2">
                <nav className="flex flex-col gap-1">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "matches", label: "Matches", icon: Users },
                    { id: "sessions", label: "Sessions", icon: Clock },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                {/* Bio */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{userData.bio}</p>
                  </CardContent>
                </Card>

                {/* Subjects */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Subjects & Proficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userData.subjects.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={cn("px-3 py-1.5", getProficiencyColor(subject.proficiency))}
                        >
                          {subject.name}
                          <span className="ml-2 text-xs opacity-70">
                            {subject.proficiency}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Styles */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Learning Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userData.learningStyles.map((style, index) => (
                        <Badge key={index} variant="secondary">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Passport */}
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Learning Passport
                      </CardTitle>
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Blockchain Verified
                      </Badge>
                    </div>
                    <CardDescription>
                      Your verified credentials and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {credentials.map((credential) => (
                        <div
                          key={credential.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-4 transition-colors",
                            credential.verified
                              ? "border-border/50 bg-card"
                              : "border-dashed border-border/30 bg-muted/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg",
                                credential.verified
                                  ? "bg-accent/20 text-accent"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{credential.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Issued by {credential.issuer}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {credential.verified ? (
                              <>
                                <Badge variant="outline" className="gap-1 text-accent border-accent/30">
                                  <Lock className="h-3 w-3" />
                                  Verified
                                </Badge>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {credential.date}
                                </p>
                              </>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                {credential.date}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Matches Tab */}
            {activeTab === "matches" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Recent Study Partners</CardTitle>
                  <CardDescription>
                    People you&apos;ve connected and studied with
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {match.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{match.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {match.subject} • Last session: {match.lastSession}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < match.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sessions Tab */}
            {activeTab === "sessions" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                  <CardDescription>
                    Your recent study sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{session.topic}</h4>
                            <p className="text-sm text-muted-foreground">
                              with {session.partner}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{session.date}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
