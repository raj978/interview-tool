"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InterviewDashboard } from "@/components/interview-dashboard"
import type { InterviewConfig } from "@/types/interview"
import { Users, Brain, Code, BarChart3, MessageSquare, Video } from "lucide-react"

const defaultConfig: InterviewConfig = {
  role: "Backend Software Engineer",
  difficulty: "medium",
  languagesAllowed: ["python", "java", "cpp"],
  durationMinutes: 45,
  realtimeHints: false,
  voice: "en-US-Neural2-D",
  rubricId: "backend_v3",
  videoAvatar: "RobotRecruiter.glb",
}

export default function HomePage() {
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [config, setConfig] = useState<InterviewConfig>(defaultConfig)

  if (interviewStarted) {
    return <InterviewDashboard config={config} onEnd={() => setInterviewStarted(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Recruiter Multi-Agent Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered interview system with specialized agents for behavioral assessment, technical
            evaluation, and real-time feedback delivery.
          </p>
        </div>

        {/* Agent Architecture Overview */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <Users className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-sm">Coordinator</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">Session orchestration</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <MessageSquare className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-sm">Behavioral</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">STAR method questions</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <Code className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-sm">Coding</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">Judge0 execution</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <BarChart3 className="h-8 w-8 mx-auto text-orange-600" />
              <CardTitle className="text-sm">Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">Score aggregation</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <Brain className="h-8 w-8 mx-auto text-red-600" />
              <CardTitle className="text-sm">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">Real-time guidance</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <Video className="h-8 w-8 mx-auto text-indigo-600" />
              <CardTitle className="text-sm">Avatar</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">LiveKit streaming</p>
            </CardContent>
          </Card>
        </div>

        {/* Interview Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Interview Configuration</CardTitle>
            <CardDescription>Current setup for the AI-powered interview session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-lg font-semibold">{config.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Difficulty</label>
                <Badge variant="secondary" className="mt-1">
                  {config.difficulty}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <p className="text-lg font-semibold">{config.durationMinutes} minutes</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Languages</label>
                <div className="flex gap-1 mt-1">
                  {config.languagesAllowed.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Behavioral questions using STAR methodology</li>
                <li>• Real-time sentiment analysis and keyword extraction</li>
                <li>• Technical coding challenges with Judge0 execution</li>
                <li>• Multi-dimensional scoring (Culture, Communication, Technical)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Real-Time Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• LiveKit audio/video streaming</li>
                <li>• 3D avatar with TTS voice synthesis</li>
                <li>• Speech-to-text transcription</li>
                <li>• Optional real-time hints and guidance</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Start Interview */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setInterviewStarted(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Start AI Interview Session
          </Button>
          <p className="text-sm text-gray-600 mt-2">Experience the future of technical recruiting</p>
        </div>
      </div>
    </div>
  )
}
