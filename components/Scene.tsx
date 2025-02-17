"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, Trail } from "@react-three/drei"
import * as THREE from "three"
import Maze, { mazeLayout } from "./Maze"
import Ghost from "./Ghost"
import { dfs, bfs, astar } from "@/utils/traversalAlgorithms"

const start = { x: 1, y: 1 }
const end = { x: 8, y: 9 }

interface SceneProps {
  algorithm: "dfs" | "bfs" | "astar"
  isRunning: boolean
}

function Particles({ count = 1000 }) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = Math.random() * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={0x88ccff} transparent opacity={0.6} />
    </points>
  )
}

export default function Scene({ algorithm, isRunning }: SceneProps) {
  const [path, setPath] = useState<{ x: number; y: number }[]>([])
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([start.x - 5, 0.5, start.y - 5])
  const [currentPathIndex, setCurrentPathIndex] = useState(0)

  useEffect(() => {
    if (isRunning) {
      let newPath: { x: number; y: number }[] = []
      console.log("Running algorithm:", algorithm)
      switch (algorithm) {
        case "dfs":
          newPath = dfs(mazeLayout, start, end)
          break
        case "bfs":
          newPath = bfs(mazeLayout, start, end)
          break
        case "astar":
          newPath = astar(mazeLayout, start, end)
          break
      }
      console.log("Generated path:", newPath)
      setPath(newPath)
      setGhostPosition([start.x - 5, 0.5, start.y - 5])
      setCurrentPathIndex(0)
    } else {
      setPath([])
      setGhostPosition([start.x - 5, 0.5, start.y - 5])
      setCurrentPathIndex(0)
    }
  }, [algorithm, isRunning])

  useEffect(() => {
    if (isRunning && path.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentPathIndex((prevIndex) => {
          if (prevIndex < path.length - 1) {
            const { x, y } = path[prevIndex + 1]
            setGhostPosition([x - 5, 0.5, y - 5])
            return prevIndex + 1
          } else {
            clearInterval(intervalId)
            return prevIndex
          }
        })
      }, 500)

      return () => clearInterval(intervalId)
    }
  }, [path, isRunning])

  useEffect(() => {
    console.log("Current ghost position:", ghostPosition)
  }, [ghostPosition])

  return (
    <Canvas camera={{ position: [0, 10, 10], fov: 75 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Particles />
      <Maze />
      <Trail width={0.2} length={5} color={new THREE.Color(0xff0000)} attenuation={(t) => t * t}>
        <Ghost position={ghostPosition} color="#FF0000" />
      </Trail>
      <OrbitControls />
    </Canvas>
  )
}

