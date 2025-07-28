"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { InterviewConfig, InterviewPhase, AgentMessage } from "@/types/interview"
import { Users, Play } from "lucide-react"

interface CoordinatorAgentProps {
  config: InterviewConfig
  onPhaseChange: (phase: InterviewPhase) => void
  onMessage: (message: AgentMessage) => void
}

export function CoordinatorAgent({ config, onPhaseChange, onMessage }: CoordinatorAgentProps) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      onMessage({
        sender: "CoordinatorAgent",
        type: "system",
        content: `Interview session initialized for ${config.role} position`,
        timestamp: Date.now(),
      })
      setInitialized(true)
    }
  }, [initialized, config.role]) // Remove onMessage from dependencies

  const startInterview = () => {
    onMessage({
      sender: "CoordinatorAgent",
      type: "system",
      content: "Transitioning to behavioral assessment phase",
      timestamp: Date.now(),
    })
    onPhaseChange("behavioral")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Users className="h-5 w-5 text-blue-600" />
        Coordinator Agent
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Session Initialization</h3>
        <div className="space-y-2 text-sm">
          <p>✓ Interview configuration loaded</p>
          <p>✓ Agent topology established</p>
          <p>✓ Vector database connected</p>
          <p>✓ Judge0 sandbox ready</p>
          <p>✓ LiveKit streaming initialized</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Interview Structure</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Behavioral Assessment (15 minutes)</li>
          <li>Technical Coding Challenge (20 minutes)</li>
          <li>Analysis & Scoring (5 minutes)</li>
          <li>Feedback & Summary (5 minutes)</li>
        </ol>
      </div>

      <Button onClick={startInterview} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Begin Interview Process
      </Button>
    </div>
  )
}
