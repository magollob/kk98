"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import type { Group, Mesh } from "three"

/* Paleta da marca: laranja sobre fundo escuro */
const ORANGE = "#ff7a00"
const ORANGE_SOFT = "#ff9a15"
const DARK = "#161616"

type ShapeConfig = {
  position: [number, number, number]
  scale: number
  geometry: "ico" | "torus" | "sphere" | "octa"
  color: string
  speed: number
  rotationIntensity: number
  floatIntensity: number
}

/* Distribuição equilibrada e espaçada para não poluir o centro da tela */
const SHAPES: ShapeConfig[] = [
  { position: [-4.2, 1.6, -2], scale: 1.15, geometry: "ico", color: ORANGE, speed: 1.1, rotationIntensity: 0.5, floatIntensity: 1.2 },
  { position: [4.4, 2.1, -3], scale: 0.9, geometry: "torus", color: ORANGE_SOFT, speed: 0.9, rotationIntensity: 0.6, floatIntensity: 1.4 },
  { position: [3.6, -2.2, -1.5], scale: 0.7, geometry: "octa", color: ORANGE, speed: 1.3, rotationIntensity: 0.7, floatIntensity: 1.1 },
  { position: [-3.8, -2.4, -2.5], scale: 0.85, geometry: "sphere", color: DARK, speed: 1.0, rotationIntensity: 0.4, floatIntensity: 1.3 },
  { position: [0.2, 3.0, -4], scale: 0.6, geometry: "ico", color: ORANGE_SOFT, speed: 0.8, rotationIntensity: 0.5, floatIntensity: 1.0 },
  { position: [0, -3.2, -3.5], scale: 0.55, geometry: "torus", color: ORANGE, speed: 1.2, rotationIntensity: 0.6, floatIntensity: 1.2 },
]

function Geometry({ type }: { type: ShapeConfig["geometry"] }) {
  switch (type) {
    case "ico":
      return <icosahedronGeometry args={[1, 0]} />
    case "octa":
      return <octahedronGeometry args={[1, 0]} />
    case "torus":
      return <torusGeometry args={[0.8, 0.3, 24, 64]} />
    case "sphere":
    default:
      return <sphereGeometry args={[1, 48, 48]} />
  }
}

function FloatingShape({ config }: { config: ShapeConfig }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.08
    meshRef.current.rotation.y += delta * 0.1
  })

  const isDark = config.color === DARK

  return (
    <Float
      speed={config.speed}
      rotationIntensity={config.rotationIntensity}
      floatIntensity={config.floatIntensity}
    >
      <mesh ref={meshRef} position={config.position} scale={config.scale}>
        <Geometry type={config.geometry} />
        <MeshDistortMaterial
          color={config.color}
          emissive={isDark ? "#000000" : config.color}
          emissiveIntensity={isDark ? 0 : 0.4}
          roughness={isDark ? 0.45 : 0.3}
          metalness={isDark ? 0.5 : 0.3}
          distort={0.28}
          speed={1.2}
          transparent
          opacity={isDark ? 0.5 : 0.92}
        />
      </mesh>
    </Float>
  )
}

function SceneContent() {
  const groupRef = useRef<Group>(null)
  const shapes = useMemo(() => SHAPES, [])

  /* Leve deriva do grupo inteiro para dar sensação de profundidade viva */
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.15
    groupRef.current.position.x = Math.sin(t * 0.04) * 0.3
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color={ORANGE_SOFT} />
      <pointLight position={[-6, -2, 2]} intensity={40} color={ORANGE} distance={20} />
      <pointLight position={[6, 4, 4]} intensity={25} color="#ffffff" distance={20} />
      <group ref={groupRef}>
        {shapes.map((config, i) => (
          <FloatingShape key={i} config={config} />
        ))}
      </group>
    </>
  )
}

export default function Scene3DBackground() {
  /* Respeita usuários que preferem menos movimento */
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={prefersReducedMotion ? "demand" : "always"}
    >
      <SceneContent />
    </Canvas>
  )
}
