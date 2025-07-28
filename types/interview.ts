export interface InterviewConfig {
  role: string
  difficulty: "easy" | "medium" | "hard"
  languagesAllowed: string[]
  durationMinutes: number
  realtimeHints: boolean
  voice: string
  rubricId: string
  videoAvatar: string
}

export type InterviewPhase = "introduction" | "behavioral" | "coding" | "analysis" | "feedback"

export interface AgentMessage {
  sender: string
  type: "system" | "question" | "response" | "analysis" | "result" | "feedback" | "speech"
  content: string
  timestamp: number
}

export interface BehavioralResponse {
  transcript: string
  sentiment: {
    score: number
  }
  keywords: string[]
}

export interface CodingResult {
  passRate: number
  execTimeMs: number
  stderr: string
  passed: number
  total: number
}

export interface AnalysisReport {
  subscores: {
    culture: number
    communication: number
    problemSolving: number
    technical: number
  }
  hireRecommend: boolean
  overallScore: number
}
