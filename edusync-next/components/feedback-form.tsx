"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, Focus, AlertCircle, Smile, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackFormProps {
  partnerName?: string
  sessionTopic?: string
  onSubmit?: (feedback: FeedbackData) => void
}

interface FeedbackData {
  rating: number
  comment: string
  tags: string[]
}

const feedbackTags = [
  { id: "helpful", label: "Helpful", icon: ThumbsUp },
  { id: "focused", label: "Focused", icon: Focus },
  { id: "distracted", label: "Distracted", icon: AlertCircle },
  { id: "friendly", label: "Friendly", icon: Smile },
]

export function FeedbackForm({
  partnerName = "Sarah Chen",
  sessionTopic = "Calculus Study Session",
  onSubmit,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  const handleSubmit = () => {
    const feedback: FeedbackData = {
      rating,
      comment,
      tags: selectedTags,
    }
    onSubmit?.(feedback)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Thank you for your feedback!</h3>
          <p className="mb-6 text-center text-muted-foreground">
            Your feedback helps us improve the study partner matching experience.
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Submit Another
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Session Feedback</CardTitle>
        <CardDescription>
          How was your study session with {partnerName}?
        </CardDescription>
        <Badge variant="secondary" className="mx-auto mt-2">
          {sessionTopic}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label className="text-center block">Rate your experience</Label>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoveredRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {rating === 0
              ? "Click to rate"
              : rating === 1
                ? "Poor"
                : rating === 2
                  ? "Fair"
                  : rating === 3
                    ? "Good"
                    : rating === 4
                      ? "Very Good"
                      : "Excellent"}
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label>How would you describe this session?</Label>
          <div className="flex flex-wrap justify-center gap-2">
            {feedbackTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <tag.icon className="h-4 w-4" />
                  {tag.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Additional comments (optional)</Label>
          <Textarea
            id="comment"
            placeholder="Share your thoughts about the session..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  )
}
