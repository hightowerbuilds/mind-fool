import { useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { InputField } from '../InputField/InputField'

export function LoginForm({ onBack, onLogin }) {
  const [activeField, setActiveField] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isHoveringBack, setIsHoveringBack] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeField) return

      if (e.key === 'Escape') {
        setActiveField(null)
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        const fields = ['username', 'password']
        const currentIndex = fields.indexOf(activeField)
        const nextIndex = e.shiftKey ? 
          (currentIndex - 1 + fields.length) % fields.length : 
          (currentIndex + 1) % fields.length
        setActiveField(fields[nextIndex])
        return
      }

      if (e.key === 'Backspace') {
        setUsername(prev => prev.slice(0, -1))
        setPassword(prev => prev.slice(0, -1))
        return
      }

      if (e.key.length === 1) {
        if (activeField === 'username') {
          setUsername(prev => prev + e.key)
        } else if (activeField === 'password') {
          setPassword(prev => prev + e.key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeField])

  return (
    <group position={[0, 0, 0]} scale={1.2}>
      {/* Form background with border */}
      <group>
        {/* Border */}
        <mesh position={[-0.05, 0, 0]}>
          <boxGeometry args={[3, 1.8, 0.1]} />
          <meshStandardMaterial
            color="#00b36b"
            emissive="#00b36b"
            emissiveIntensity={0.2}
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* Background */}
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[2.9, 1.7, 0.05]} />
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>

      {/* Go back button */}
      <group 
        position={[1.2, 0.8, 0.2]} 
        onClick={onBack}
        onPointerOver={() => setIsHoveringBack(true)}
        onPointerOut={() => setIsHoveringBack(false)}
      >
        <Text
          position={[-0.15, 0, 0]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
        >
          go back
        </Text>
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={isHoveringBack ? 0.5 : 0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Input fields */}
      <InputField
        label="username"
        position={[0, 0.2, 0]}
        value={username}
        onChange={setUsername}
        isActive={activeField === 'username'}
        onActivate={() => setActiveField('username')}
      />
      <InputField
        label="password"
        position={[0, -0.2, 0]}
        value={password}
        onChange={setPassword}
        isActive={activeField === 'password'}
        onActivate={() => setActiveField('password')}
      />

      {/* Login text button */}
      <group position={[0, -0.7, 0.1]} onClick={onLogin}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#0066ff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
          outlineWidth={0.01}
          outlineColor="#0066ff"
          outlineOpacity={0.5}
        >
          login
        </Text>
      </group>
    </group>
  )
} 