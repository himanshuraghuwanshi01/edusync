import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Sparkles, ArrowRight, CheckCircle2, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Smart Matching",
    description: "Our AI analyzes your learning style, subjects, and availability to find the perfect study partners.",
  },
  {
    icon: Sparkles,
    title: "AI Tutor",
    description: "Get instant help from our AI tutor during study sessions. Ask questions and get explanations in real-time.",
  },
  {
    icon: Users,
    title: "Collaborative Tools",
    description: "Shared whiteboards, video calls, and chat features to make studying together seamless.",
  },
]

const benefits = [
  "Personalized matching based on your learning style",
  "Real-time collaboration with study partners",
  "24/7 AI tutor support",
  "Track your progress and achievements",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth isLoggedIn={false} />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          
          <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                AI-Powered Learning Platform
              </div>
              
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Study Partner
                </span>
              </h1>
              
              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                AI-powered matching for collaborative learning. Connect with students who share your goals, 
                schedule, and learning style.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Globe className="h-4 w-4" />
                    View Demo
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>10,000+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>500+ universities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>95% match success</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to learn better
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our platform combines AI technology with collaborative learning to help you achieve your academic goals.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                  Learn smarter, not harder
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Join thousands of students who have transformed their study habits with EduSync. 
                  Our AI-powered platform makes finding the right study partner effortless.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      Start Learning Today
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-8">
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border/50 bg-card/80 p-6 shadow-xl backdrop-blur-sm">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">AI-Powered Matching</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Our algorithm considers learning style, schedule, subjects, and goals to find your ideal study partner.
                    </p>
                    <div className="mt-6 flex gap-2">
                      {[85, 92, 78].map((score, i) => (
                        <div key={i} className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {score}% Match
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to find your study partner?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Join EduSync today and start collaborating with students who match your learning style and goals.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 EduSync. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
