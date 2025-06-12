import { Canvas } from '@react-three/fiber'
import { Stars as ThreeStars } from '@react-three/drei'
import './Stars.css'

export function Stars() {
  return (
    <div className="stars-container">
      <Canvas>
        <ThreeStars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
      </Canvas>
    </div>
  )
} 