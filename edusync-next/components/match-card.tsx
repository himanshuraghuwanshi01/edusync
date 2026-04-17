"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, UserPlus } from "lucide-react"
import Link from "next/link"

interface MatchCardProps {
  id: string
  name: string
  avatar?: string
  subjects: string[]
  matchScore: number
  availability?: string
  bio?: string
}

export function MatchCard({
  id,
  name,
  avatar,
  subjects,
  matchScore,
  availability,
  bio,
}: MatchCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Determine color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-accent"
    if (score >= 70) return "text-primary"
    return "text-muted-foreground"
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar with match score ring */}
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${matchScore}%, transparent ${matchScore}%)`,
                opacity: 0.3,
              }}
            />
            <Avatar className="h-14 w-14 border-2 border-background">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Match score badge */}
            <div
              className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-bold shadow ${getScoreColor(matchScore)}`}
            >
              {matchScore}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{name}</h3>
                {availability && (
                  <p className="text-xs text-muted-foreground">{availability}</p>
                )}
              </div>
              <Badge
                variant="secondary"
                className={`shrink-0 ${getScoreColor(matchScore)}`}
              >
                {matchScore}% Match
              </Badge>
            </div>

            {/* Subjects */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {subjects.slice(0, 3).map((subject, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-border/50 bg-muted/50 text-xs"
                >
                  {subject}
                </Badge>
              ))}
              {subjects.length > 3 && (
                <Badge
                  variant="outline"
                  className="border-border/50 bg-muted/50 text-xs text-muted-foreground"
                >
                  +{subjects.length - 3} more
                </Badge>
              )}
            </div>

            {/* Bio preview */}
            {bio && (
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {bio}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1 gap-2">
                <UserPlus className="h-4 w-4" />
                Connect
              </Button>
              <Link href={`/chat?partner=${id}`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
