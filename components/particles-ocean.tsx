"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function Particles({ count = 500, color = "#0066cc" }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      temp[i3] = (Math.random() - 0.5) * 20
      temp[i3 + 1] = (Math.random() - 0.5) * 20
      temp[i3 + 2] = (Math.random() - 0.5) * 20
    }
    return temp
  }, [count])

  const sizes = useMemo(() => {
    const temp = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      temp[i] = Math.random() * 2 + 0.5
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.002
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <group ref={group}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 4 + Math.random() * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 4,
              Math.sin(angle) * radius
            ]}
          >
            <icosahedronGeometry args={[0.2 + Math.random() * 0.3, 0]} />
            <meshBasicMaterial 
              color="#0088aa"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function ParticlesOcean({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={600} color="#0077aa" />
        <Particles count={300} color="#00aacc" />
        <FloatingShapes />
      </Canvas>
    </div>
  )
}
