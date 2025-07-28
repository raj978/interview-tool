"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { InterviewConfig, InterviewPhase, AgentMessage } from "@/types/interview"
import { CoordinatorAgent } from "@/components/agents/coordinator-agent"
import { BehavioralAgent } from "@/components/agents/behavioral-agent"
import { CodingAgent } from "@/components/agents/coding-agent"
import { AnalysisAgent } from "@/components/agents/analysis-agent"
import { FeedbackAgent } from "@/components/agents/feedback-agent"
import { AvatarAgent } from "@/components/agents/avatar-agent"
import { InterviewReport } from "@/components/interview-report"
import { Clock, Users, MessageSquare, Code, BarChart3, Brain } from "lucide-react"

interface InterviewDashboardProps {
  config: InterviewConfig
  onEnd: () => void
}

export function InterviewDashboard({ config, onEnd }: InterviewDashboardProps) {
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>("introduction")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [scores, setScores] = useState({
    culture: 0,
    communication: 0,
    problemSolving: 0,
    technical: 0,
    overall: 0,
  })

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const addMessage = (message: AgentMessage) => {
    setMessages((prev) => [...prev, { ...message, timestamp: Date.now() }])
  }

  const updateScores = (newScores: Partial<typeof scores>) => {
    setScores((prev) => ({ ...prev, ...newScores }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (timeElapsed / (config.durationMinutes * 60)) * 100

  if (interviewComplete) {
    return <InterviewReport config={config} scores={scores} messages={messages} onClose={onEnd} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Session</h1>
              <p className="text-gray-600">
                {config.role} - {config.difficulty} level
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeElapsed)} / {config.durationMinutes}:00
                </div>
                <Progress value={progress} className="w-32 mt-1" />
              </div>
              <Button variant="outline" onClick={onEnd}>
                End Interview
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar Agent */}
            <AvatarAgent config={config} currentPhase={currentPhase} onMessage={addMessage} />

            {/* Current Agent Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentPhase === "behavioral" && <MessageSquare className="h-5 w-5 text-green-600" />}
                  {currentPhase === "coding" && <Code className="h-5 w-5 text-purple-600" />}
                  {currentPhase === "analysis" && <BarChart3 className="h-5 w-5 text-orange-600" />}
                  {currentPhase === "feedback" && <Brain className="h-5 w-5 text-red-600" />}
                  Current Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPhase === "introduction" && (
                  <CoordinatorAgent config={config} onPhaseChange={setCurrentPhase} onMessage={addMessage} />
                )}
                {currentPhase === "behavioral" && (
                  <BehavioralAgent
                    config={config}
                    onComplete={() => setCurrentPhase("coding")}
                    onMessage={addMessage}
                  />
                )}
                {currentPhase === "coding" && (
                  <CodingAgent config={config} onComplete={() => setCurrentPhase("analysis")} onMessage={addMessage} />
                )}
                {currentPhase === "analysis" && (
                  <AnalysisAgent
                    messages={messages}
                    onComplete={(scores) => {
                      updateScores(scores)
                      setCurrentPhase("feedback")
                    }}
                    onMessage={addMessage}
                  />
                )}
                {currentPhase === "feedback" && (
                  <FeedbackAgent
                    scores={scores}
                    messages={messages}
                    onComplete={() => setInterviewComplete(true)}
                    onMessage={addMessage}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Culture Fit</span>
                    <span>{scores.culture}/100</span>
                  </div>
                  <Progress value={scores.culture} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Communication</span>
                    <span>{scores.communication}/100</span>
                  </div>
                  <Progress value={scores.communication} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Problem Solving</span>
                    <span>{scores.problemSolving}/100</span>
                  </div>
                  <Progress value={scores.problemSolving} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Skills</span>
                    <span>{scores.technical}/100</span>
                  </div>
                  <Progress value={scores.technical} className="h-2" />
                </div>
                <hr />
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Overall Score</span>
                    <span>{scores.overall}/100</span>
                  </div>
                  <Progress value={scores.overall} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Agent Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Coordinator</span>
                  </div>
                  <Badge variant={currentPhase === "introduction" ? "default" : "secondary"}>
                    {currentPhase === "introduction" ? "Active" : "Standby"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">Behavioral</span>
                  </div>
                  <Badge variant={currentPhase === "behavioral" ? "default" : "secondary"}>
                    {currentPhase === "behavioral" ? "Active" : "Standby"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm">Coding</span>
                  </div>
                  <Badge variant={currentPhase === "coding" ? "default" : "secondary"}>
                    {currentPhase === "coding" ? "Active" : "Standby"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm">Analysis</span>
                  </div>
                  <Badge variant={currentPhase === "analysis" ? "default" : "secondary"}>
                    {currentPhase === "analysis" ? "Active" : "Standby"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm">Feedback</span>
                  </div>
                  <Badge variant={currentPhase === "feedback" ? "default" : "secondary"}>
                    {currentPhase === "feedback" ? "Active" : "Standby"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {messages.slice(-5).map((message, index) => (
                    <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-700">{message.sender}</div>
                      <div className="text-gray-600 truncate">{message.content}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
