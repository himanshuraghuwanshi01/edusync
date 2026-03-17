"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { FeedbackForm } from "@/components/feedback-form"

export default function FeedbackPage() {
  const router = useRouter()

  const handleFeedbackSubmit = (feedback: { rating: number; comment: string; tags: string[] }) => {
    console.log("Feedback submitted:", feedback)
    // In a real app, this would send to an API
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <FeedbackForm
            partnerName="Sarah Chen"
            sessionTopic="Calculus Study Session"
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </main>
    </div>
  )
}
