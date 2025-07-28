"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InterviewConfig, InterviewPhase, AgentMessage } from "@/types/interview"
import { Video, VideoOff, Volume2, VolumeX } from "lucide-react"

interface AvatarAgentProps {
  config: InterviewConfig
  currentPhase: InterviewPhase
  onMessage: (message: AgentMessage) => void
}

export function AvatarAgent({ config, currentPhase, onMessage }: AvatarAgentProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")

  const phaseMessages = {
    introduction:
      "Welcome to your AI-powered interview! I'm your virtual recruiter. Let's begin with some introductory questions.",
    behavioral: "Now I'll ask you some behavioral questions. Please use the STAR method in your responses.",
    coding: "Time for the technical assessment. You'll solve coding problems with real-time execution.",
    analysis: "I'm analyzing your responses and performance. Please wait while I process the data.",
    feedback: "Based on your interview, here's your personalized feedback and recommendations.",
  }

  useEffect(() => {
    const message = phaseMessages[currentPhase]
    setCurrentMessage(message)

    // Simulate speaking animation
    setIsSpeaking(true)
    const speakingTimer = setTimeout(() => setIsSpeaking(false), 3000)

    // Only send message if phase actually changed
    const messageToSend = {
      sender: "AvatarAgent",
      type: "speech" as const,
      content: message,
      timestamp: Date.now(),
    }

    onMessage(messageToSend)

    return () => clearTimeout(speakingTimer)
  }, [currentPhase]) // Remove onMessage from dependencies to prevent infinite loop

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-indigo-600" />
            Avatar Agent - LiveKit Stream
          </div>
          <div className="flex gap-2">
            <Badge variant={isSpeaking ? "default" : "secondary"}>{isSpeaking ? "Speaking" : "Listening"}</Badge>
            <Badge variant="outline">{config.voice}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Video Stream Simulation */}
          <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg aspect-video flex items-center justify-center">
            {isVideoEnabled ? (
              <div className="text-center">
                <div
                  className={`w-24 h-24 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center ${isSpeaking ? "animate-pulse" : ""}`}
                >
                  <div className="w-16 h-16 bg-indigo-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">AI Recruiter Avatar</div>
                {isSpeaking && (
                  <div className="mt-2">
                    <div className="flex justify-center gap-1">
                      <div className="w-1 h-4 bg-indigo-400 rounded animate-pulse"></div>
                      <div
                        className="w-1 h-6 bg-indigo-500 rounded animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-5 bg-indigo-400 rounded animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-7 bg-indigo-500 rounded animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="w-1 h-4 bg-indigo-400 rounded animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <VideoOff className="h-12 w-12 mx-auto mb-2" />
                <div>Video Disabled</div>
              </div>
            )}
          </div>

          {/* Current Message */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-indigo-800 mb-2">Current Message:</div>
            <p className="text-indigo-700">{currentMessage}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setIsVideoEnabled(!isVideoEnabled)}>
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
              {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          {/* Stream Info */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>LiveKit WebRTC Connection: Active</div>
            <div>TTS Engine: {config.voice}</div>
            <div>3D Avatar Model: {config.videoAvatar}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
