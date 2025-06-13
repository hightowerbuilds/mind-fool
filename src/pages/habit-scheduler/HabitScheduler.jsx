import { useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { Stars } from '../../components/Stars/Stars'
import './HabitScheduler.css'

function Planet() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#4a90e2" />
    </mesh>
  )
}

function Ring() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.5, 3.5, 64]} />
      <meshStandardMaterial color="#ff6b6b" side={2} transparent opacity={0.7} />
    </mesh>
  )
}

function DayNumber({ day, position }) {
  const textRef = useRef()
  
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.3}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/JetBrainsMono-Bold.ttf"
    >
      {day}
    </Text>
  )
}

function DayNumbers({ selectedMonth }) {
  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear()
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(selectedMonth)
  const radius = 3.8
  
  return (
    <>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const angle = (i / daysInMonth) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <DayNumber 
            key={day}
            day={day}
            position={[x, 0, z]}
          />
        )
      })}
    </>
  )
}

function CameraController({ targetDay, selectedMonth }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    if (targetDay !== null && controlsRef.current) {
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate()
      const angle = ((targetDay - 1) / daysInMonth) * Math.PI * 2
      const radius = 8
      const targetX = Math.cos(angle) * radius
      const targetZ = Math.sin(angle) * radius
      
      const targetPosition = new THREE.Vector3(targetX, 0, targetZ)
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(0, 0, 0)
      
      // Log for debugging
      console.log('Animating to day:', targetDay, 'angle:', angle, 'position:', targetPosition)
    }
  })

  return <OrbitControls ref={controlsRef} enableZoom={true} enablePan={true} enableRotate={true} />
}

export function HabitScheduler() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [targetDay, setTargetDay] = useState(null)
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear()
    return new Date(year, month + 1, 0).getDate()
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value))
    setTargetDay(null)
  }

  const handleDayClick = (day) => {
    console.log('Day clicked:', day)
    setTargetDay(day)
  }

  return (
    <>
      <Stars />
      <div className="habit-scheduler-page">
        <h1 className="title">Habit Scheduler</h1>
        
        <div className="month-selector">
          <label htmlFor="month">Select Month:</label>
          <select 
            id="month" 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="month-dropdown"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        
        <div className="canvas-container">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Planet />
            <Ring />
            <DayNumbers selectedMonth={selectedMonth} />
            <CameraController targetDay={targetDay} selectedMonth={selectedMonth} />
          </Canvas>
        </div>
        
        <div className="day-squares-container">
          {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => (
            <div 
              key={i + 1} 
              className="day-square"
              onClick={() => {
                console.log('Square clicked:', i + 1)
                handleDayClick(i + 1)
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}