"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Plus, X, Check, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface Subject {
  name: string
  proficiency: string
}

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
}

const steps = [
  { id: 1, title: "Account", description: "Create your account" },
  { id: 2, title: "Subjects", description: "Select your subjects" },
  { id: 3, title: "Availability", description: "Set your schedule" },
  { id: 4, title: "Profile", description: "Complete your profile" },
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const times = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return `${hour}:00`
})

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced"]
const learningStyles = ["Visual", "Auditory", "Kinesthetic"]

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1: Account
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Step 2: Subjects
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectProficiency, setNewSubjectProficiency] = useState("")
  
  // Step 3: Availability
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedDay, setSelectedDay] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  
  // Step 4: Profile
  const [bio, setBio] = useState("")
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<string[]>([])

  const progress = (currentStep / steps.length) * 100

  const addSubject = () => {
    if (newSubjectName && newSubjectProficiency) {
      setSubjects([...subjects, { name: newSubjectName, proficiency: newSubjectProficiency }])
      setNewSubjectName("")
      setNewSubjectProficiency("")
    }
  }

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const addTimeSlot = () => {
    if (selectedDay && startTime && endTime) {
      setTimeSlots([...timeSlots, { day: selectedDay, startTime, endTime }])
      setSelectedDay("")
      setStartTime("")
      setEndTime("")
    }
  }

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index))
  }

  const toggleLearningStyle = (style: string) => {
    setSelectedLearningStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name && email && password
      case 2:
        return subjects.length > 0
      case 3:
        return timeSlots.length > 0
      case 4:
        return bio && selectedLearningStyles.length > 0
      default:
        return true
    }
  }

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    router.push("/dashboard")
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} isLoggedIn={false} />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Create your EduSync account</h1>
            <p className="text-muted-foreground">Complete the steps below to get started</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="mt-4 flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center",
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                          ? "border-2 border-primary bg-primary/10 text-primary"
                          : "border border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span className="hidden text-xs font-medium sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Account */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Subjects */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Name</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., Mathematics"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Proficiency Level</Label>
                      <Select value={newSubjectProficiency} onValueChange={setNewSubjectProficiency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSubject}
                    disabled={!newSubjectName || !newSubjectProficiency}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </Button>

                  {subjects.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your Subjects</Label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="gap-2 py-1.5 pl-3 pr-2"
                          >
                            {subject.name}
                            <span className="text-xs text-muted-foreground">
                              ({subject.proficiency})
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSubject(index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-muted"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Availability */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeSlot}
                    disabled={!selectedDay || !startTime || !endTime}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Time Slot
                  </Button>

                  {timeSlots.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your Schedule</Label>
                      <div className="space-y-2">
                        {timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3"
                          >
                            <span className="text-sm">
                              <span className="font-medium">{slot.day}</span>{" "}
                              <span className="text-muted-foreground">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(index)}
                              className="rounded-full p-1 hover:bg-muted"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Profile */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself and your learning goals..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Learning Style</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the learning styles that best describe you
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {learningStyles.map((style) => (
                        <label
                          key={style}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-all",
                            selectedLearningStyles.includes(style)
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary/30"
                          )}
                        >
                          <Checkbox
                            checked={selectedLearningStyles.includes(style)}
                            onCheckedChange={() => toggleLearningStyle(style)}
                          />
                          <span className="text-sm font-medium">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                  {currentStep < steps.length && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
