import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei'

function AnimatedShape() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <MeshDistortMaterial
          color={hovered ? '#00ff73' : '#10b981'}
          speed={3}
          distort={0.4}
          radius={1}
        />
      </Sphere>
    </Float>
  )
}

function SmallShapes() {
  return (
    <>
      <Float speed={3} position={[-2, 1, -1]} rotationIntensity={2}>
        <mesh scale={0.4}>
          <octahedronGeometry />
          <MeshWobbleMaterial color="#00ff73" speed={2} factor={0.5} />
        </mesh>
      </Float>
      <Float speed={4} position={[2, -1, -2]} rotationIntensity={2}>
        <mesh scale={0.3}>
          <icosahedronGeometry />
          <MeshWobbleMaterial color="#a1b0a7" speed={3} factor={0.4} />
        </mesh>
      </Float>
    </>
  )
}

export default function TechScene() {
  return (
    <div className="tech-scene-container" style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff73" />
        
        <AnimatedShape />
        <SmallShapes />
      </Canvas>
    </div>
  )
}
