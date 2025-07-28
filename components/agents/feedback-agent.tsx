"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AgentMessage } from "@/types/interview"
import { Brain, TrendingUp, Target, BookOpen } from "lucide-react"

interface FeedbackAgentProps {
  scores: {
    culture: number
    communication: number
    problemSolving: number
    technical: number
    overall: number
  }
  messages: AgentMessage[]
  onComplete: () => void
  onMessage: (message: AgentMessage) => void
}

export function FeedbackAgent({ scores, messages, onComplete, onMessage }: FeedbackAgentProps) {
  const [feedbackGenerated, setFeedbackGenerated] = useState(false)

  useEffect(() => {
    if (!feedbackGenerated) {
      onMessage({
        sender: "FeedbackAgent",
        type: "system",
        content: "Generating personalized feedback and recommendations...",
        timestamp: Date.now(),
      })

      const timer = setTimeout(() => {
        setFeedbackGenerated(true)
        onMessage({
          sender: "FeedbackAgent",
          type: "feedback",
          content: "Comprehensive feedback report generated",
          timestamp: Date.now(),
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [feedbackGenerated]) // Remove onMessage from dependencies

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Strong</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Developing</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const getHireRecommendation = () => {
    if (scores.overall >= 85) return { level: "Strong Hire", color: "text-green-600", icon: "🎯" }
    if (scores.overall >= 70) return { level: "Hire", color: "text-blue-600", icon: "✅" }
    if (scores.overall >= 55) return { level: "Lean No", color: "text-yellow-600", icon: "⚠️" }
    return { level: "No Hire", color: "text-red-600", icon: "❌" }
  }

  const recommendation = getHireRecommendation()

  const strengths = [
    "Demonstrated strong problem-solving approach using structured thinking",
    "Excellent communication skills with clear articulation of technical concepts",
    "Showed adaptability when faced with challenging scenarios",
  ]

  const improvements = [
    "Consider practicing more complex algorithmic problems to improve technical depth",
    "Work on providing more specific examples when discussing past experiences",
    "Focus on explaining trade-offs when making technical decisions",
  ]

  const resources = [
    { title: "LeetCode Premium", description: "Advanced coding practice", icon: "💻" },
    { title: "System Design Interview", description: "Architecture patterns", icon: "🏗️" },
    { title: "Behavioral Interview Guide", description: "STAR method mastery", icon: "🎭" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Brain className="h-5 w-5 text-red-600" />
        Feedback Agent
      </div>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Assessment</span>
            <div className={`text-2xl ${recommendation.color}`}>
              {recommendation.icon} {recommendation.level}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {"█".repeat(Math.floor(scores.overall / 10))}
              {"▌".repeat(scores.overall % 10 >= 5 ? 1 : 0)}
              {"░".repeat(10 - Math.floor(scores.overall / 10) - (scores.overall % 10 >= 5 ? 1 : 0))}
            </div>
            <div className="text-2xl font-bold">{scores.overall}/100</div>
            <div className="text-gray-600">Overall Readiness Score</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-xl font-bold ${getScoreColor(scores.culture)}`}>{scores.culture}</div>
              <div className="text-sm text-gray-600 mb-1">Culture Fit</div>
              {getScoreBadge(scores.culture)}
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${getScoreColor(scores.communication)}`}>{scores.communication}</div>
              <div className="text-sm text-gray-600 mb-1">Communication</div>
              {getScoreBadge(scores.communication)}
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${getScoreColor(scores.problemSolving)}`}>{scores.problemSolving}</div>
              <div className="text-sm text-gray-600 mb-1">Problem Solving</div>
              {getScoreBadge(scores.problemSolving)}
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${getScoreColor(scores.technical)}`}>{scores.technical}</div>
              <div className="text-sm text-gray-600 mb-1">Technical Skills</div>
              {getScoreBadge(scores.technical)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">→</span>
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommended Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Recommended Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{resource.icon}</span>
                <div>
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-gray-600">{resource.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Keep Growing! 🚀</h3>
            <p className="text-gray-700">
              Your interview performance shows strong potential. Continue developing your skills and you'll be
              well-prepared for your next opportunity. Remember, every interview is a learning experience that brings
              you closer to your goals.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onComplete} size="lg">
          View Complete Report
        </Button>
      </div>
    </div>
  )
}
