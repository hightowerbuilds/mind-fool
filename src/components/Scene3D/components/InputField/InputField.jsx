import { Text } from '@react-three/drei'

export function InputField({ label, position, value, onChange, isActive, onActivate }) {
  const handleKeyDown = (e) => {
    if (!isActive) return

    if (e.key === 'Backspace') {
      onChange(value.slice(0, -1))
      return
    }

    if (e.key.length === 1) {
      onChange(value + e.key)
    }
  }

  const handlePointerOver = (e) => {
    if (e.pointerType === 'mouse') {
      document.body.style.cursor = 'text'
    }
    e.stopPropagation()
  }

  const handlePointerOut = (e) => {
    if (e.pointerType === 'mouse') {
      document.body.style.cursor = 'auto'
    }
    e.stopPropagation()
  }

  return (
    <group position={position}>
      {/* Label */}
      <Text
        position={[-1.2, 0, 0.2]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.ttf"
        renderOrder={2}
      >
        {label}:
      </Text>
      
      {/* Input background */}
      <mesh 
        position={[0.3, 0, 0]}
        onClick={onActivate}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onKeyDown={handleKeyDown}
      >
        <boxGeometry args={[1.7, 0.25, 0.05]} />
        <meshStandardMaterial
          color={isActive ? "#0066ff" : "#0a0a0a"}
          emissive={isActive ? "#0066ff" : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Input text - always visible */}
      <Text
        position={[-0.4, 0, 0.2]}
        fontSize={0.12}
        color={isActive ? "#0066ff" : "#ffffff"}
        anchorX="left"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.ttf"
        renderOrder={2}
      >
        {value || ' '}{isActive && '|'}
      </Text>
    </group>
  )
} 