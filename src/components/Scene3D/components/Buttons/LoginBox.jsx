import { Text } from '@react-three/drei'

export function LoginBox({ onClick }) {
  return (
    <group position={[0, -0.9, 0]} scale={0.8}>
      <mesh 
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.stopPropagation()
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'auto'
          e.stopPropagation()
        }}
      >
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.2}
        color="#00b36b"
        anchorX="center"
        anchorY="middle"
        font="/fonts/JetBrainsMono-Regular.ttf"
        outlineWidth={0.01}
        outlineColor="#00b36b"
        outlineOpacity={0.5}
        transparent
        opacity={0.8}
      >
        login
      </Text>
    </group>
  )
} 