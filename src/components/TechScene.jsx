import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, Sparkles } from '@react-three/drei'

function AnimatedShape() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.25
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={1.8} floatIntensity={2.2}>
      <Sphere
        ref={meshRef}
        args={[1.05, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.25 : 1}
      >
        <MeshDistortMaterial
          color={hovered ? '#00ff88' : '#10b981'}
          roughness={0.15}
          metalness={0.8}
          speed={3.5}
          distort={0.45}
          radius={1}
        />
      </Sphere>
    </Float>
  )
}

function FloatingGeometry() {
  return (
    <>
      <Float speed={3} position={[-2.2, 1.2, -1]} rotationIntensity={2}>
        <mesh scale={0.45}>
          <octahedronGeometry />
          <MeshWobbleMaterial color="#00ff88" speed={2.5} factor={0.6} roughness={0.2} metalness={0.7} />
        </mesh>
      </Float>

      <Float speed={4} position={[2.2, -1.2, -1.5]} rotationIntensity={2.5}>
        <mesh scale={0.35}>
          <icosahedronGeometry />
          <MeshWobbleMaterial color="#06b6d4" speed={3} factor={0.5} roughness={0.2} metalness={0.7} />
        </mesh>
      </Float>

      <Float speed={2} position={[0, -2, -2]} rotationIntensity={1.5}>
        <mesh scale={0.25}>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <MeshWobbleMaterial color="#6366f1" speed={2} factor={0.4} roughness={0.3} metalness={0.8} />
        </mesh>
      </Float>
    </>
  )
}

export default function TechScene() {
  return (
    <div className="tech-scene-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#00ff88" />
        <pointLight position={[10, -5, 5]} intensity={1} color="#06b6d4" />
        
        <Sparkles count={45} scale={6} size={2.5} speed={0.4} color="#10b981" opacity={0.6} />
        <AnimatedShape />
        <FloatingGeometry />
      </Canvas>
    </div>
  )
}
