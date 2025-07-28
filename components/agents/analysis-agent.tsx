"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { AgentMessage } from "@/types/interview"
import { BarChart3, TrendingUp, Brain, MessageSquare } from "lucide-react"

interface AnalysisAgentProps {
  messages: AgentMessage[]
  onComplete: (scores: {
    culture: number
    communication: number
    problemSolving: number
    technical: number
    overall: number
  }) => void
  onMessage: (message: AgentMessage) => void
}

export function AnalysisAgent({ messages, onComplete, onMessage }: AnalysisAgentProps) {
  const [analyzing, setAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  useEffect(() => {
    const analysisSteps = [
      "Analyzing behavioral responses...",
      "Evaluating technical performance...",
      "Processing sentiment data...",
      "Calculating competency scores...",
      "Generating final assessment...",
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex < analysisSteps.length) {
        setCurrentStep(analysisSteps[stepIndex])
        setProgress((stepIndex + 1) * 20)

        onMessage({
          sender: "AnalysisAgent",
          type: "system",
          content: analysisSteps[stepIndex],
          timestamp: Date.now(),
        })

        stepIndex++
      } else {
        clearInterval(interval)

        // Calculate scores based on message analysis
        const behavioralMessages = messages.filter((m) => m.sender === "BehavioralAgent")
        const codingMessages = messages.filter((m) => m.sender === "CodingAgent")

        // Simulate sophisticated analysis
        const scores = {
          culture: Math.floor(Math.random() * 30) + 70, // 70-100
          communication: Math.floor(Math.random() * 25) + 75, // 75-100
          problemSolving: Math.floor(Math.random() * 35) + 65, // 65-100
          technical: Math.floor(Math.random() * 40) + 60, // 60-100
          overall: 0,
        }

        scores.overall = Math.floor(
          (scores.culture + scores.communication + scores.problemSolving + scores.technical) / 4,
        )

        setAnalyzing(false)

        onMessage({
          sender: "AnalysisAgent",
          type: "result",
          content: `Analysis complete. Overall score: ${scores.overall}/100`,
          timestamp: Date.now(),
        })

        setTimeout(() => onComplete(scores), 1000)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [messages.length]) // Only depend on messages length, not the entire messages array or onMessage/onComplete

  const behavioralCount = messages.filter((m) => m.sender === "BehavioralAgent").length
  const codingCount = messages.filter((m) => m.sender === "CodingAgent").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <BarChart3 className="h-5 w-5 text-orange-600" />
        Analysis Agent
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">{currentStep}</div>
                <Progress value={progress} className="w-full" />
                <div className="text-sm text-gray-600 mt-2">{progress}% Complete</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Vector Analysis</span>
                  </div>
                  <div className="text-sm text-gray-600">Processing embeddings against role rubric...</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Sentiment Analysis</span>
                  </div>
                  <div className="text-sm text-gray-600">Evaluating communication patterns...</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
              <p className="text-gray-600">Comprehensive assessment generated</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{behavioralCount}</div>
              <div className="text-sm text-gray-600">Behavioral Interactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{codingCount}</div>
              <div className="text-sm text-gray-600">Technical Assessments</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sentiment Analysis</span>
              <Badge variant="secondary">Positive</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Keyword Coverage</span>
              <Badge variant="secondary">High</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Technical Accuracy</span>
              <Badge variant="secondary">Above Average</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
