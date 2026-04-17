"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ChatMessage } from "@/components/chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical, Bot, Clock, Users, Loader2, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Message {
  id: string
  sender_id?: string
  text: string
  created_at: string
  is_ai: boolean
  sender?: {
    name: string
    avatar?: string
    isAI?: boolean
  }
}

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const partnerId = searchParams.get("partner")
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [partner, setPartner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  useEffect(() => {
    if (user && partnerId) {
      initChat()
    }
  }, [user, partnerId])

  const initChat = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      
      // Get partner info
      const partnerRes = await fetch(`${apiUrl}/users/${partnerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!partnerRes.ok) {
        throw new Error("Partner not found")
      }

      const partnerData = await partnerRes.json()
      setPartner(partnerData)
      console.log("✅ Partner loaded:", partnerData.name)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load chat"
      console.error("❌ Chat init error:", err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isAiTyping])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Add message to local state for immediate feedback
    const tempMessage: Message = {
      id: Date.now().toString(),
      sender_id: user?.id,
      text: newMessage,
      created_at: new Date().toISOString(),
      is_ai: false,
      sender: { name: user?.name, avatar: user?.avatar },
    }

    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")
    console.log("📤 Message sent:", newMessage)

    // Here you would send to backend/socket
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Navbar showAuth isLoggedIn />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-muted-foreground">Partner not found</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={partner?.avatar} alt={partner?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {partner?.name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{partner?.name || "Study Session"}</h2>
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" title="Connected" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Learning Partnership</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled title="Coming soon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled title="Coming soon">
              <Video className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/profile`}>View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Session Info Bar */}
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Real-time Chat</span>
            </div>
            <Badge variant="outline" className="gap-1">
              <Bot className="h-3 w-3" />
              AI Tutor Ready
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Start your message with /ask to get AI tutor assistance
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <Users className="h-12 w-12 mb-4 opacity-20" />
                <p>No messages yet. Start the conversation!</p>
                <p className="text-xs mt-1">Try asking the AI Tutor a question with /ask</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender?.name || (msg.is_ai ? "AI Tutor" : (msg.sender_id === user?.id ? "You" : partner?.name))}
                message={msg.text}
                timestamp={new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                isOwn={msg.sender_id === user?.id}
                avatar={msg.sender?.avatar}
              />
            ))}

            {/* AI Typing indicator */}
            {isAiTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Bot className="h-5 w-5 text-accent" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 delay-[0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 delay-[150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 delay-[300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border/40 bg-card/50 p-4 backdrop-blur-sm">
          <form onSubmit={sendMessage} className="mx-auto flex max-w-3xl gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message... (use /ask for AI help)"
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
