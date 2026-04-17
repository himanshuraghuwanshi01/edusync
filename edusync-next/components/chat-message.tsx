"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

interface ChatMessageProps {
  sender: string
  message: string
  timestamp: string
  isOwn?: boolean
  avatar?: string
}

export function ChatMessage({
  sender,
  message,
  timestamp,
  isOwn = false,
  avatar,
}: ChatMessageProps) {
  const initials = sender
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Check if message is an AI tutor question (starts with /ask)
  const isAIQuestion = message.startsWith("/ask")
  const displayMessage = isAIQuestion ? message.replace("/ask ", "") : message

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {isAIQuestion ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
          <Bot className="h-5 w-5 text-accent" />
        </div>
      ) : (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={avatar} alt={sender} />
          <AvatarFallback className={cn(
            "text-sm",
            isOwn ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={cn("flex max-w-[75%] flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {isAIQuestion ? "AI Tutor" : sender}
          </span>
          <span className="text-xs text-muted-foreground/60">{timestamp}</span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isAIQuestion
              ? "bg-accent/10 text-accent-foreground border border-accent/20"
              : isOwn
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayMessage}</p>
        </div>
      </div>
    </div>
  )
}
