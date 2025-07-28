class APIClient {
  private baseURL: string
  private wsURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    this.wsURL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"
  }

  async startInterview(config: any) {
    const response = await fetch(`${this.baseURL}/api/interview/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error(`Failed to start interview: ${response.statusText}`)
    }

    return response.json()
  }

  async getInterviewStatus(sessionId: string) {
    const response = await fetch(`${this.baseURL}/api/interview/${sessionId}/status`)

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`)
    }

    return response.json()
  }

  async endInterview(sessionId: string) {
    const response = await fetch(`${this.baseURL}/api/interview/${sessionId}/end`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Failed to end interview: ${response.statusText}`)
    }

    return response.json()
  }

  createWebSocket(sessionId: string) {
    return new WebSocket(`${this.wsURL}/ws/${sessionId}`)
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`)
      return response.ok ? await response.json() : { status: "unhealthy" }
    } catch {
      return { status: "unreachable" }
    }
  }
}

export const apiClient = new APIClient()
