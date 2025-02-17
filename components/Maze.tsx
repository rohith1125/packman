import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { type Mesh, MeshStandardMaterial, TextureLoader } from "three"
import { useLoader } from "@react-three/fiber"

export const mazeLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export default function Maze() {
  const mazeRef = useRef<Mesh>(null)
  const wallTexture = useLoader(TextureLoader, "/placeholder.svg?height=128&width=128")
  const floorTexture = useLoader(TextureLoader, "/placeholder.svg?height=128&width=128")

  useFrame((state) => {
    if (mazeRef.current) {
      mazeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const wallMaterial = new MeshStandardMaterial({
    map: wallTexture,
    color: 0x4a148c,
    roughness: 0.7,
    metalness: 0.2,
    emissive: 0x1a0033,
    emissiveIntensity: 0.2,
  })

  const floorMaterial = new MeshStandardMaterial({
    map: floorTexture,
    color: 0x7e57c2,
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0x3f1dcb,
    emissiveIntensity: 0.1,
  })

  const startMaterial = new MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.5,
  })

  const endMaterial = new MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.5,
  })

  return (
    <group ref={mazeRef}>
      {mazeLayout.map((row, i) =>
        row.map((cell, j) => {
          if (cell === 1) {
            return (
              <mesh key={`wall-${i}-${j}`} position={[j - 5, 0.5, i - 5]} material={wallMaterial}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
            )
          } else if (cell === 2) {
            return (
              <mesh key={`start-${i}-${j}`} position={[j - 5, 0.1, i - 5]} material={startMaterial}>
                <boxGeometry args={[0.8, 0.2, 0.8]} />
              </mesh>
            )
          } else if (cell === 3) {
            return (
              <mesh key={`end-${i}-${j}`} position={[j - 5, 0.1, i - 5]} material={endMaterial}>
                <boxGeometry args={[0.8, 0.2, 0.8]} />
              </mesh>
            )
          }
          return null
        }),
      )}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial}>
        <planeGeometry args={[11, 11]} />
      </mesh>
      {mazeLayout.map((row, i) =>
        row.map((cell, j) => {
          if (cell === 0) {
            return (
              <mesh key={`pellet-${i}-${j}`} position={[j - 5, 0.2, i - 5]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={0xffff00} emissive={0xffff00} emissiveIntensity={0.5} />
              </mesh>
            )
          }
          return null
        }),
      )}
    </group>
  )
}

