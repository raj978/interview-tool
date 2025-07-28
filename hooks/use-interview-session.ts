"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { InterviewConfig, AgentMessage } from "@/types/interview"

export function useInterviewSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)

  const startInterview = useCallback(async (config: InterviewConfig) => {
    try {
      const response = await apiClient.startInterview(config)
      const newSessionId = response.session_id

      setSessionId(newSessionId)

      // Create WebSocket connection
      const ws = apiClient.createWebSocket(newSessionId)

      ws.onopen = () => {
        setIsConnected(true)
        console.log("Connected to interview session")
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setMessages((prev) => [...prev, message])
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("Disconnected from interview session")
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      }

      setWebsocket(ws)

      return newSessionId
    } catch (error) {
      console.error("Failed to start interview:", error)
      throw error
    }
  }, [])

  const sendMessage = useCallback(
    (agent: string, action: string, payload: any = {}) => {
      if (websocket && isConnected) {
        const message = {
          agent,
          action,
          payload,
          timestamp: Date.now(),
        }
        websocket.send(JSON.stringify(message))
      }
    },
    [websocket, isConnected],
  )

  const endInterview = useCallback(async () => {
    if (!sessionId) return

    try {
      const response = await apiClient.endInterview(sessionId)

      if (websocket) {
        websocket.close()
        setWebsocket(null)
      }

      setIsConnected(false)
      return response
    } catch (error) {
      console.error("Failed to end interview:", error)
      throw error
    }
  }, [sessionId, websocket])

  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [websocket])

  return {
    sessionId,
    isConnected,
    messages,
    startInterview,
    sendMessage,
    endInterview,
  }
}
