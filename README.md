# AI Recruiter Multi-Agent Interview Platform

A comprehensive AI-powered interview system with specialized agents for behavioral assessment, technical evaluation, and real-time feedback delivery.

## 🚀 Features

- **Multi-Agent Architecture**: 6 specialized AI agents working in coordination
- **Real-Time Communication**: LiveKit integration for audio/video streaming
- **Code Execution**: Judge0 API for safe code execution and testing
- **Vector Database**: Intelligent candidate response analysis and matching
- **Comprehensive Scoring**: Multi-dimensional assessment with detailed feedback
- **Enterprise Ready**: EEOC/OFCCP compliant with bias-free evaluation

## 🏗️ Architecture

### AI Agents
- **CoordinatorAgent**: Orchestrates interview flow and phase transitions
- **BehavioralAgent**: Conducts STAR-method behavioral interviews
- **CodingAgent**: Presents technical challenges with real-time execution
- **AnalysisAgent**: Performs multi-dimensional scoring and competency analysis
- **FeedbackAgent**: Generates personalized feedback and recommendations
- **AvatarAgent**: Manages 3D avatar and TTS/STT communication

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.8+, WebSockets
- **AI Services**: OpenAI GPT-4, Anthropic Claude
- **Code Execution**: Judge0 API
- **Real-Time**: LiveKit WebRTC
- **Vector DB**: Pinecone (or simulated)
- **Database**: SQLite/PostgreSQL

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <repository-url>
cd ai-recruiter-platform
npm install
\`\`\`

### 2. Setup Python Backend

\`\`\`bash
# Install Python dependencies and create .env file
npm run setup-backend

# Or manually:
python scripts/setup_backend.py
\`\`\`

### 3. Configure API Keys

Update the `.env` file with your API keys:

\`\`\`env
# Required for AI functionality
OPENAI_API_KEY=your_openai_api_key_here

# Optional but recommended
JUDGE0_API_KEY=your_rapidapi_key_here
LIVEKIT_API_KEY=your_livekit_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
\`\`\`

### 4. Start the Application

\`\`\`bash
# Start both backend and frontend
npm run dev-full

# Or start separately:
npm run start-backend  # Python FastAPI server on :8000
npm run dev            # Next.js frontend on :3000
\`\`\`

## 🔑 API Keys Required

### Essential (for core functionality):
- **OpenAI API Key**: For AI-powered behavioral analysis and feedback generation
  - Get from: https://platform.openai.com/api-keys
  - Used by: BehavioralAgent, AnalysisAgent, FeedbackAgent

### Optional (enhanced features):
- **Judge0 API Key**: For real code execution (falls back to simulation)
  - Get from: https://rapidapi.com/judge0-official/api/judge0-ce
  - Used by: CodingAgent

- **LiveKit API Key**: For real-time audio/video (falls back to simulation)
  - Get from: https://livekit.io/
  - Used by: AvatarAgent

- **Pinecone API Key**: For vector database (falls back to in-memory)
  - Get from: https://www.pinecone.io/
  - Used by: AnalysisAgent, VectorDBService

## 📡 API Endpoints

### Interview Management
- `POST /api/interview/start` - Start new interview session
- `GET /api/interview/{session_id}/status` - Get interview status
- `POST /api/interview/{session_id}/end` - End interview and generate report
- `WS /ws/{session_id}` - WebSocket for real-time communication

### Health Check
- `GET /api/health` - Check service health status
- `GET /` - API information and agent status

## 🎯 Usage Example

\`\`\`typescript
import { useInterviewSession } from '@/hooks/use-interview-session'

function InterviewComponent() {
  const { startInterview, sendMessage, messages, isConnected } = useInterviewSession()

  const handleStart = async () => {
    const config = {
      role: "Backend Software Engineer",
      difficulty: "medium",
      languages_allowed: ["python", "java"],
      duration_minutes: 45,
      realtime_hints: false,
      voice: "en-US-Neural2-D",
      rubric_id: "backend_v3",
      video_avatar: "RobotRecruiter.glb"
    }

    await startInterview(config)
  }

  const handleResponse = (response: string) => {
    sendMessage("behavioral", "submit_response", { response })
  }

  return (
    <div>
      <button onClick={handleStart}>Start Interview</button>
      {/* Interview UI components */}
    </div>
  )
}
\`\`\`

## 🔒 Security & Compliance

- **PII Protection**: Automatic removal of personally identifiable information
- **Bias Prevention**: Randomized questions and objective scoring rubrics
- **EEOC Compliance**: Fair and unbiased evaluation criteria
- **Data Security**: Encrypted communication and secure storage

## 🚦 Development Status

- ✅ Multi-agent architecture implemented
- ✅ Real-time WebSocket communication
- ✅ Behavioral assessment with AI analysis
- ✅ Code execution simulation (Judge0 integration ready)
- ✅ Vector database simulation (Pinecone integration ready)
- ✅ Comprehensive scoring and feedback system
- ✅ LiveKit integration framework
- ⏳ Production deployment configuration
- ⏳ Advanced analytics dashboard

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `http://localhost:8000/docs`
- Review the health check endpoint for service status
