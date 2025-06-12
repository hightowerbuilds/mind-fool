import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import './Scene3D.css'

// Create a canvas texture with text
function createTextTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // Fill with orange gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#ff8c00')    // Dark orange
  gradient.addColorStop(1, '#ff4500')    // Orange-red
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Add text with a contrasting color
  ctx.fillStyle = '#ffffff'  // White text for better contrast
  ctx.font = 'bold 80px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Split text into two lines
  ctx.fillText('Bobby!', canvas.width/2, canvas.height/2 - 40)
  ctx.fillText('You can do it!', canvas.width/2, canvas.height/2 + 40)
  
  return canvas
}

function Planet() {
  const planet = useRef()
  const texture = useMemo(() => {
    const canvas = createTextTexture()
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  return (
    <group ref={planet} scale={0.75}>
      {/* Main planet sphere with text */}
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>
    </group>
  )
}

export function Scene3D() {
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        {/* Background stars */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Planet */}
        <Planet />
        
        {/* Controls */}
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