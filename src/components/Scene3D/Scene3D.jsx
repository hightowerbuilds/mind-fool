import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { SignUpBox } from './components/Buttons/SignUpBox'
import { LoginBox } from './components/Buttons/LoginBox'
import { SignUpForm } from './components/Forms/SignUpForm'
import { LoginForm } from './components/Forms/LoginForm'
import './Scene3D.css'

export function Scene3D() {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
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
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minDistance={5}
          maxDistance={10}
          autoRotate={!showSignUp && !showLogin}
          autoRotateSpeed={0.5}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Main scene content */}
        <group>
          {/* Buttons and Form */}
          {!showSignUp && !showLogin && (
            <>
              <SignUpBox onClick={() => setShowSignUp(true)} />
              <LoginBox onClick={() => setShowLogin(true)} />
            </>
          )}
          
          {/* Forms */}
          {showSignUp && (
            <SignUpForm onClose={() => setShowSignUp(false)} />
          )}
          {showLogin && (
            <LoginForm 
              onBack={() => setShowLogin(false)}
              onLogin={() => {
                // Handle login logic here
                console.log('Login clicked')
              }}
            />
          )}
        </group>
      </Canvas>
    </div>
  )
} 