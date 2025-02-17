"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshStandardMaterial, type Group } from "three"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

interface GhostProps {
  position: [number, number, number]
  color: string
}

export default function Ghost({ position, color }: GhostProps) {
  const ghostRef = useRef<Group>(null)
  const ghostTexture = useLoader(TextureLoader, "/placeholder.svg?height=128&width=128")

  useEffect(() => {
    if (ghostRef.current) {
      ghostRef.current.position.set(...position)
    }
  }, [position])

  useFrame((state) => {
    if (ghostRef.current) {
      ghostRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      ghostRef.current.rotation.y += 0.02
    }
  })

  const bodyMaterial = new MeshStandardMaterial({
    map: ghostTexture,
    color: color,
    transparent: true,
    opacity: 0.8,
    roughness: 0.3,
    metalness: 0.2,
    emissive: color,
    emissiveIntensity: 0.2,
  })

  const eyeMaterial = new MeshStandardMaterial({ color: "white", roughness: 0.3, metalness: 0.8 })
  const pupilMaterial = new MeshStandardMaterial({ color: "black", roughness: 0.3, metalness: 0.8 })

  return (
    <group ref={ghostRef}>
      <mesh material={bodyMaterial}>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
      </mesh>
      <mesh position={[0, -0.3, 0]} material={bodyMaterial}>
        <cylinderGeometry args={[0.5, 0.2, 0.4, 32]} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.4]} material={eyeMaterial}>
        <sphereGeometry args={[0.12, 32, 32]} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.4]} material={eyeMaterial}>
        <sphereGeometry args={[0.12, 32, 32]} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.5]} material={pupilMaterial}>
        <sphereGeometry args={[0.06, 32, 32]} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.5]} material={pupilMaterial}>
        <sphereGeometry args={[0.06, 32, 32]} />
      </mesh>
      <pointLight color={color} intensity={0.5} distance={2} />
    </group>
  )
}

