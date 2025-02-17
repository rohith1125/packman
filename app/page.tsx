"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })

export default function Home() {
  const [algorithm, setAlgorithm] = useState<"dfs" | "bfs" | "astar">("dfs")
  const [isRunning, setIsRunning] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{ path: string; position: string }>({ path: "", position: "" })

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setAlgorithm("dfs")
    setDebugInfo({ path: "", position: "" })
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "DEBUG_INFO") {
        setDebugInfo(event.data.payload)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-4 text-center lg:text-left">Pac-Man Ghost Traversal Algorithms</h1>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
          <Select value={algorithm} onValueChange={(value: "dfs" | "bfs" | "astar") => setAlgorithm(value)}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="dfs">Depth-First Search</SelectItem>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleStart} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
            Start
          </Button>
          <Button variant="outline" onClick={handleReset} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Reset
          </Button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-400px)] mt-8 rounded-lg overflow-hidden shadow-2xl">
        <Suspense
          fallback={<div className="w-full h-full flex items-center justify-center bg-gray-800">Loading...</div>}
        >
          <Scene algorithm={algorithm} isRunning={isRunning} />
        </Suspense>
      </div>
      <Card className="mt-8 w-full max-w-5xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Follow these steps to visualize the traversal algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select an algorithm from the dropdown menu (DFS, BFS, or A*).</li>
            <li>Click the &quot;Start&quot; button to begin the visualization.</li>
            <li>Watch as the ghost traverses the maze using the selected algorithm.</li>
            <li>The green square represents the start point (1, 1).</li>
            <li>The red square represents the end point (8, 9).</li>
            <li>The ghost will navigate from the start to the end point.</li>
            <li>Use the &quot;Reset&quot; button to clear the visualization and start over.</li>
            <li>You can rotate and zoom the 3D view using your mouse or touchpad.</li>
          </ol>
        </CardContent>
      </Card>
      <Card className="mt-8 w-full max-w-5xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current Path: {debugInfo.path}</p>
          <p>Ghost Position: {debugInfo.position}</p>
        </CardContent>
      </Card>
    </main>
  )
}

