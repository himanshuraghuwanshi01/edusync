"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ChatMessage } from "@/components/chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical, Bot, Clock, Users } from "lucide-react"
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
  sender: string
  message: string
  timestamp: string
  isOwn: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    message: "Hey! Ready to start our study session?",
    timestamp: "2:30 PM",
    isOwn: false,
  },
  {
    id: "2",
    sender: "You",
    message: "Yes! I've been reviewing chapter 5 on derivatives. The chain rule is still confusing me.",
    timestamp: "2:31 PM",
    isOwn: true,
  },
  {
    id: "3",
    sender: "Sarah Chen",
    message: "Oh, I struggled with that too! Let me share my notes. The key is to work from the outside in.",
    timestamp: "2:32 PM",
    isOwn: false,
  },
  {
    id: "4",
    sender: "AI Tutor",
    message: "/ask The chain rule states that if y = f(g(x)), then dy/dx = f'(g(x)) × g'(x). Think of it as peeling layers of an onion - differentiate the outer function first, keeping the inner function unchanged, then multiply by the derivative of the inner function. Would you like me to walk through an example?",
    timestamp: "2:33 PM",
    isOwn: false,
  },
  {
    id: "5",
    sender: "You",
    message: "That analogy really helps! Yes, can we try an example with sin(x²)?",
    timestamp: "2:34 PM",
    isOwn: true,
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Add a mock response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Sarah Chen",
        message: "Great question! Let me think about that...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      }
      setMessages((prev) => [...prev, response])
    }, 1500)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="Sarah Chen" />
              <AvatarFallback className="bg-primary/10 text-primary">SC</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Calculus Study Session</h2>
                <Badge variant="secondary" className="text-xs">
                  <Users className="mr-1 h-3 w-3" />2
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>Sarah Chen is online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Session History</DropdownMenuItem>
                <DropdownMenuItem>Share Notes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/feedback">End Session</Link>
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
              <span>Session: 45 min</span>
            </div>
            <Badge variant="outline" className="gap-1">
              <Bot className="h-3 w-3" />
              AI Tutor Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Start your message with /ask to get AI tutor assistance
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                sender={msg.sender}
                message={msg.message}
                timestamp={msg.timestamp}
                isOwn={msg.isOwn}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
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
