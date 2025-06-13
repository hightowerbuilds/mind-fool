import { useState, useEffect } from 'react'
import { Text } from '@react-three/drei'
import { InputField } from '../InputField/InputField'

export function SignUpForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  })
  const [activeField, setActiveField] = useState(null)
  const [isHoveringClose, setIsHoveringClose] = useState(false)
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeField) return

      if (e.key === 'Escape') {
        setActiveField(null)
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        const fields = ['name', 'username', 'password']
        const currentIndex = fields.indexOf(activeField)
        const nextIndex = e.shiftKey ? 
          (currentIndex - 1 + fields.length) % fields.length : 
          (currentIndex + 1) % fields.length
        setActiveField(fields[nextIndex])
        return
      }

      if (e.key === 'Backspace') {
        setFormData(prev => ({
          ...prev,
          [activeField]: prev[activeField].slice(0, -1)
        }))
        return
      }

      if (e.key.length === 1) {
        setFormData(prev => ({
          ...prev,
          [activeField]: prev[activeField] + e.key
        }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeField])

  return (
    <group position={[0, 0, 0]} scale={1.2}>
      {/* Close button sphere and text */}
      <group position={[1.2, 1.1, 0]}>
        <mesh 
          position={[0, 0, 0]}
          scale={isHoveringClose ? 1.1 : 1}
          onClick={onClose}
          onPointerOver={() => setIsHoveringClose(true)}
          onPointerOut={() => setIsHoveringClose(false)}
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={isHoveringClose ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[-0.12, 0, 0]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.ttf"
        >
          go back
        </Text>
      </group>

      {/* Form background with glow */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[3, 2.5, 0.1]} />
        <meshStandardMaterial
          color="#00b36b"
          emissive="#00b36b"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Input fields */}
      <InputField
        label="name"
        position={[0, 0.4, 0]}
        value={formData.name}
        onChange={handleInputChange}
        isActive={activeField === 'name'}
        onActivate={() => setActiveField('name')}
      />
      <InputField
        label="username"
        position={[0, 0, 0]}
        value={formData.username}
        onChange={handleInputChange}
        isActive={activeField === 'username'}
        onActivate={() => setActiveField('username')}
      />
      <InputField
        label="password"
        position={[0, -0.4, 0]}
        value={formData.password}
        onChange={handleInputChange}
        isActive={activeField === 'password'}
        onActivate={() => setActiveField('password')}
      />
      
      {/* Begin Membership Button */}
      <group position={[0, -1.1, 0]} scale={0.75}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#0066ff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Bold.ttf"
          outlineWidth={0.01}
          outlineColor="#0066ff"
          outlineOpacity={0.5}
        >
          begin your membership
        </Text>
      </group>
    </group>
  )
} 