"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { MatchCard } from "@/components/match-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Users, BookOpen, Calendar, TrendingUp } from "lucide-react"

// Mock data for demonstration
const mockMatches = [
  {
    id: "1",
    name: "Sarah Chen",
    subjects: ["Mathematics", "Physics", "Computer Science"],
    matchScore: 92,
    availability: "Weekdays, 6-9 PM",
    bio: "Engineering student passionate about problem-solving. Looking for study partners for calculus and physics.",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    subjects: ["Computer Science", "Data Structures", "Algorithms"],
    matchScore: 87,
    availability: "Weekends, Flexible",
    bio: "CS major interested in competitive programming and machine learning.",
  },
  {
    id: "3",
    name: "Emily Watson",
    subjects: ["Biology", "Chemistry", "Organic Chemistry"],
    matchScore: 85,
    availability: "Tue/Thu, 2-5 PM",
    bio: "Pre-med student looking for study groups for MCAT preparation.",
  },
  {
    id: "4",
    name: "Michael Kim",
    subjects: ["Economics", "Statistics", "Finance"],
    matchScore: 78,
    availability: "Mon/Wed, 7-10 PM",
    bio: "Business student focused on quantitative analysis and market research.",
  },
  {
    id: "5",
    name: "Jessica Liu",
    subjects: ["Psychology", "Neuroscience", "Research Methods"],
    matchScore: 75,
    availability: "Flexible schedule",
    bio: "Psychology major interested in cognitive science and behavioral research.",
  },
  {
    id: "6",
    name: "David Thompson",
    subjects: ["History", "Political Science", "Philosophy"],
    matchScore: 72,
    availability: "Afternoons",
    bio: "Humanities student with a focus on modern history and political theory.",
  },
]

const subjects = ["All Subjects", "Mathematics", "Computer Science", "Physics", "Biology", "Chemistry", "Economics", "Psychology", "History"]
const availabilityOptions = ["Any Time", "Weekday Mornings", "Weekday Evenings", "Weekends", "Flexible"]

export default function DashboardPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedAvailability, setSelectedAvailability] = useState("Any Time")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredMatches = mockMatches.filter((match) => {
    if (selectedSubject !== "All Subjects" && !match.subjects.includes(selectedSubject)) {
      return false
    }
    return true
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Study Partner Matches</h1>
          <p className="mt-2 text-muted-foreground">
            Find students who match your learning style and schedule
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Matches
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMatches.length}</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Sessions
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hours Studied
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.5</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Match Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-accent">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Find New Matches
          </Button>

          {selectedSubject !== "All Subjects" && (
            <Badge variant="secondary" className="gap-1">
              {selectedSubject}
              <button
                onClick={() => setSelectedSubject("All Subjects")}
                className="ml-1 rounded-full hover:bg-muted"
              >
                ×
              </button>
            </Badge>
          )}
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredMatches.length} potential study partners
        </p>

        {/* Match Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              id={match.id}
              name={match.name}
              subjects={match.subjects}
              matchScore={match.matchScore}
              availability={match.availability}
              bio={match.bio}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No matches found</h3>
            <p className="mb-4 max-w-sm text-muted-foreground">
              Try adjusting your filters or check back later for new study partners.
            </p>
            <Button onClick={() => setSelectedSubject("All Subjects")}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
