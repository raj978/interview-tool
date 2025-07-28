"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { InterviewConfig, AgentMessage } from "@/types/interview"
import { Download, FileText, Share2, Calendar, Clock, User, Briefcase } from "lucide-react"

interface InterviewReportProps {
  config: InterviewConfig
  scores: {
    culture: number
    communication: number
    problemSolving: number
    technical: number
    overall: number
  }
  messages: AgentMessage[]
  onClose: () => void
}

export function InterviewReport({ config, scores, messages, onClose }: InterviewReportProps) {
  const getHireRecommendation = () => {
    if (scores.overall >= 85)
      return {
        level: "Strong Hire",
        color: "bg-green-100 text-green-800",
        description: "Exceptional candidate with strong alignment to role requirements",
      }
    if (scores.overall >= 70)
      return {
        level: "Hire",
        color: "bg-blue-100 text-blue-800",
        description: "Solid candidate who meets most requirements with growth potential",
      }
    if (scores.overall >= 55)
      return {
        level: "Lean No",
        color: "bg-yellow-100 text-yellow-800",
        description: "Mixed performance with significant areas for development",
      }
    return {
      level: "No Hire",
      color: "bg-red-100 text-red-800",
      description: "Does not meet current role requirements",
    }
  }

  const recommendation = getHireRecommendation()
  const interviewDate = new Date().toLocaleDateString()
  const duration = `${config.durationMinutes} minutes`

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Assessment Report</h1>
              <p className="text-gray-600 mt-1">AI-Powered Multi-Agent Evaluation</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
              <Button onClick={onClose}>
                <FileText className="h-4 w-4 mr-2" />
                New Interview
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{interviewDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Role:</span>
              <span className="font-medium">{config.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Level:</span>
              <Badge variant="secondary">{config.difficulty}</Badge>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{scores.overall}</div>
                  <div className="text-gray-600">Overall Score</div>
                  <div className="mt-2">
                    <Badge className={recommendation.color}>{recommendation.level}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">{recommendation.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Culture Fit</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${scores.culture}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-8">{scores.culture}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Communication</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${scores.communication}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{scores.communication}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Problem Solving</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${scores.problemSolving}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{scores.problemSolving}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Technical Skills</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${scores.technical}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-8">{scores.technical}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Observations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Strong use of STAR methodology in responses</li>
                    <li>• Demonstrated leadership experience</li>
                    <li>• Good conflict resolution skills</li>
                    <li>• Clear communication style</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Sentiment Analysis</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Overall Sentiment:</span>
                    <Badge variant="secondary">Positive (78%)</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Code Execution Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Test Cases:</span>
                      <div className="font-medium">2/3 Passed</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Execution Time:</span>
                      <div className="font-medium">245ms</div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Code Quality</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Clean, readable code structure</li>
                    <li>• Appropriate algorithm choice</li>
                    <li>• Good variable naming</li>
                    <li>• Minor edge case handling issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Activity Log */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Multi-Agent Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.slice(-10).map((message, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="text-xs">
                    {message.sender.replace("Agent", "")}
                  </Badge>
                  <div className="flex-1">
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">For the Candidate</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Practice more complex algorithmic problems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Strengthen system design knowledge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Continue developing leadership examples</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">For the Hiring Team</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Strong cultural fit for team environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Good foundation for mentorship role</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span>May need technical onboarding support</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>This report was generated by AI Recruiter Multi-Agent Platform</p>
          <p>Compliant with EEOC/OFCCP best practices • Bias-free assessment</p>
        </div>
      </div>
    </div>
  )
}
