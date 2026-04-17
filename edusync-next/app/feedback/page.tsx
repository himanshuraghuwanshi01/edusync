"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { FeedbackForm } from "@/components/feedback-form"

function FeedbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const partnerName = searchParams.get("partner") || undefined
  const sessionTopic = searchParams.get("topic") || undefined

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
            partnerName={partnerName}
            sessionTopic={sessionTopic}
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </main>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <FeedbackContent />
    </Suspense>
  )
}
