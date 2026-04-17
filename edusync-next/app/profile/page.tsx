"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  User,
  Users,
  Clock,
  BookOpen,
  Award,
  Edit,
  Calendar,
  Star,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const getProficiencyColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "advanced":
      return "bg-accent/20 text-accent border-accent/30"
    case "intermediate":
      return "bg-primary/20 text-primary border-primary/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (!storedUser || !token) {
          router.push("/login")
          return
        }

        const userData = JSON.parse(storedUser)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        
        // Fetch complete profile
        const res = await fetch(`${apiUrl}/users/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const fullProfile = await res.json()
          setUser(fullProfile)
        } else if (res.status === 401) {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          setUser(userData)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load profile"
        console.error("Profile load error:", err)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showAuth isLoggedIn={false} />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Profile not found. Please log in again.</p>
        </div>
      </div>
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2" disabled>
                    <Edit className="h-4 w-4" />
                    Edit Profile (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <Card className="border-border/50">
              <CardContent className="p-2">
                <nav className="flex flex-col gap-1">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "subjects", label: "Subjects", icon: BookOpen },
                    { id: "schedule", label: "Schedule", icon: Clock },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
                    <p className="text-muted-foreground">
                      {user.bio || "No bio added yet. Edit your profile to add one!"}
                    </p>
                  </CardContent>
                </Card>

                {/* Learning Style */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Learning Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.learning_style ? (
                        Object.entries(user.learning_style).map(([key, value]: [string, any]) => {
                          if (value) {
                            const label =
                              key === "visual"
                                ? "Visual"
                                : key === "auditory"
                                  ? "Auditory"
                                  : key === "kinesthetic"
                                    ? "Kinesthetic"
                                    : key
                            return <Badge key={key} variant="secondary">{label}</Badge>
                          }
                          return null
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No learning style set</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Subjects Tab */}
            {activeTab === "subjects" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Subjects
                  </CardTitle>
                  <CardDescription>Subjects and proficiency levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.subjects && user.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.subjects.map((subject: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={cn(
                            "px-3 py-1.5",
                            getProficiencyColor(subject.level || subject.proficiency),
                          )}
                        >
                          {subject.name}
                          <span className="ml-2 text-xs opacity-70">
                            {subject.level || subject.proficiency || "N/A"}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subjects added yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Your Availability
                  </CardTitle>
                  <CardDescription>When you&apos;re available to study</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.availability && user.availability.length > 0 ? (
                    <div className="space-y-2">
                      {user.availability.map((slot: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                        >
                          <span className="font-medium">{slot.day}</span>
                          <span className="text-sm text-muted-foreground">
                            {slot.start_time || slot.startTime} - {slot.end_time || slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No availability set yet.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
