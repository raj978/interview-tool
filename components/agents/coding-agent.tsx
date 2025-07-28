"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InterviewConfig, AgentMessage } from "@/types/interview"
import { Code, Play, CheckCircle, XCircle, Clock } from "lucide-react"

interface CodingAgentProps {
  config: InterviewConfig
  onComplete: () => void
  onMessage: (message: AgentMessage) => void
}

const codingProblems = {
  easy: {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
  },
  medium: {
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    example: "Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
      { input: "[[1,4],[4,5]]", expected: "[[1,5]]" },
      { input: "[[1,4],[0,4]]", expected: "[[0,4]]" },
    ],
  },
  hard: {
    title: "Serialize and Deserialize Binary Tree",
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    example: "Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]",
    testCases: [
      { input: "[1,2,3,null,null,4,5]", expected: "[1,2,3,null,null,4,5]" },
      { input: "[]", expected: "[]" },
      { input: "[1]", expected: "[1]" },
    ],
  },
}

export function CodingAgent({ config, onComplete, onMessage }: CodingAgentProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(config.languagesAllowed[0])
  const [code, setCode] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{
    passRate: number
    execTimeMs: number
    stderr: string
    passed: number
    total: number
  } | null>(null)

  const problem = codingProblems[config.difficulty as keyof typeof codingProblems]

  useEffect(() => {
    onMessage({
      sender: "CodingAgent",
      type: "question",
      content: `Coding challenge: ${problem.title}`,
      timestamp: Date.now(),
    })
  }, [problem.title])

  const executeCode = async () => {
    if (!code.trim()) return

    setIsExecuting(true)
    onMessage({
      sender: "CodingAgent",
      type: "system",
      content: "Executing code in Judge0 sandbox...",
      timestamp: Date.now(),
    })

    // Simulate Judge0 execution
    setTimeout(() => {
      const passed = Math.floor(Math.random() * problem.testCases.length) + 1
      const total = problem.testCases.length
      const passRate = (passed / total) * 100
      const execTime = Math.floor(Math.random() * 500) + 50

      const result = {
        passRate,
        execTimeMs: execTime,
        stderr: passed === total ? "" : "Test case 2 failed: Expected [1,2] but got [2,1]",
        passed,
        total,
      }

      setExecutionResult(result)
      setIsExecuting(false)

      onMessage({
        sender: "CodingAgent",
        type: "result",
        content: `Code execution completed: ${passed}/${total} tests passed (${passRate.toFixed(1)}%)`,
        timestamp: Date.now(),
      })
    }, 2000)
  }

  const submitSolution = () => {
    onMessage({
      sender: "CodingAgent",
      type: "system",
      content: "Coding assessment completed. Proceeding to analysis phase.",
      timestamp: Date.now(),
    })
    onComplete()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Code className="h-5 w-5 text-purple-600" />
        Coding Agent
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{problem.title}</span>
            <Badge variant="secondary">{config.difficulty}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Problem Description</h4>
              <p className="mb-3">{problem.description}</p>
              <div className="bg-white p-3 rounded border">
                <strong>Example:</strong>
                <pre className="text-sm mt-1 whitespace-pre-wrap">{problem.example}</pre>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Programming Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.languagesAllowed.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Solution</label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Write your ${selectedLanguage} solution here
// Time limit: 5 seconds
// Memory limit: 256 MB

function solution() {
    // Your code here
}`}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={executeCode} disabled={!code.trim() || isExecuting} variant="outline">
                {isExecuting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>

              <Button onClick={submitSolution} disabled={!executionResult}>
                Submit Solution
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {executionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {executionResult.passRate === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {executionResult.passed}/{executionResult.total}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{executionResult.passRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{executionResult.execTimeMs}ms</div>
                <div className="text-sm text-gray-600">Execution Time</div>
              </div>
            </div>

            {executionResult.stderr && (
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <strong className="text-red-800">Error Output:</strong>
                <pre className="text-sm text-red-700 mt-1">{executionResult.stderr}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
