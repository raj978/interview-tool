"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { InterviewConfig, AgentMessage } from "@/types/interview"
import { MessageSquare, Send, Mic, MicOff } from "lucide-react"

interface BehavioralAgentProps {
  config: InterviewConfig
  onComplete: () => void
  onMessage: (message: AgentMessage) => void
}

const behavioralQuestions = [
  {
    id: 1,
    question:
      "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
    category: "Teamwork",
    followUp: "What would you do differently if faced with a similar situation?",
  },
  {
    id: 2,
    question:
      "Describe a situation where you had to learn a new technology quickly to complete a project. What was your approach?",
    category: "Learning Agility",
    followUp: "How do you typically stay updated with new technologies?",
  },
  {
    id: 3,
    question:
      "Give me an example of a time when you had to make a decision with incomplete information. What was the outcome?",
    category: "Decision Making",
    followUp: "How do you typically handle uncertainty in your work?",
  },
]

export function BehavioralAgent({ config, onComplete, onMessage }: BehavioralAgentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [response, setResponse] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [responses, setResponses] = useState<
    Array<{ question: string; answer: string; sentiment: number; keywords: string[] }>
  >([])

  const currentQuestion = behavioralQuestions[currentQuestionIndex]

  useEffect(() => {
    onMessage({
      sender: "BehavioralAgent",
      type: "question",
      content: currentQuestion.question,
      timestamp: Date.now(),
    })
  }, [currentQuestionIndex, currentQuestion.question]) // Remove onMessage from dependencies

  const analyzeResponse = (text: string) => {
    // Simulate sentiment analysis and keyword extraction
    const keywords =
      text
        .toLowerCase()
        .match(
          /\b(team|collaboration|leadership|problem|solution|challenge|success|failure|learn|improve|communicate|manage|deliver|quality|deadline|customer|user|technical|code|debug|optimize|scale|performance)\b/g,
        ) || []
    const sentiment = Math.random() * 0.6 + 0.2 // Simulate positive sentiment

    return {
      sentiment,
      keywords: [...new Set(keywords)],
    }
  }

  const submitResponse = () => {
    if (!response.trim()) return

    const analysis = analyzeResponse(response)

    const responseData = {
      question: currentQuestion.question,
      answer: response,
      sentiment: analysis.sentiment,
      keywords: analysis.keywords,
    }

    setResponses((prev) => [...prev, responseData])

    onMessage({
      sender: "BehavioralAgent",
      type: "analysis",
      content: `Response analyzed: Sentiment ${(analysis.sentiment * 100).toFixed(0)}%, Keywords: ${analysis.keywords.join(", ")}`,
      timestamp: Date.now(),
    })

    if (currentQuestionIndex < behavioralQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setResponse("")
    } else {
      onMessage({
        sender: "BehavioralAgent",
        type: "system",
        content: "Behavioral assessment completed. Transitioning to coding phase.",
        timestamp: Date.now(),
      })
      onComplete()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate speech-to-text
      setTimeout(() => {
        setResponse((prev) => prev + " [Voice input simulated]")
        setIsRecording(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5 text-green-600" />
        Behavioral Agent
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Question {currentQuestionIndex + 1} of {behavioralQuestions.length}
            </span>
            <Badge variant="secondary">{currentQuestion.category}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-lg">{currentQuestion.question}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Response (STAR Method Recommended)</label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Situation: Describe the context...
Task: What needed to be accomplished...
Action: What specific actions did you take...
Result: What was the outcome..."
                rows={8}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={toggleRecording}
                className={isRecording ? "bg-red-50 border-red-200" : ""}
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? "Stop Recording" : "Voice Input"}
              </Button>

              <Button onClick={submitResponse} disabled={!response.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Submit Response
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {responses.map((resp, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium mb-1">Question {index + 1}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Sentiment: {(resp.sentiment * 100).toFixed(0)}% | Keywords: {resp.keywords.slice(0, 3).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
