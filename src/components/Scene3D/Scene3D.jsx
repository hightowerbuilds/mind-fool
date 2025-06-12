import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import './Scene3D.css'

function Head() {
  const head = useRef()

  return (
    <group ref={head} scale={0.75}>
      {/* Main head sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#00b36b"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.3, 0.3, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.3, 0.3, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0, 1]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#00b36b" />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.3, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

export function Scene3D() {
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Head />
        <OrbitControls 
          minDistance={2}
          maxDistance={8}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
} 