import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Stars } from '../../components/Stars/Stars'
import { supabase } from '../../lib/supabase'
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

function InputField3D({ position, value, onSubmit, onClose }) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef()
  const groupRef = useRef()

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(inputValue)
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh position={[0, -0.2, 0]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial 
          color="#000000" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Border */}
      <mesh position={[0, -0.2, 0.01]}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshStandardMaterial 
          color="#00b36b" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Input field using HTML */}
      <Html
        position={[0, -0.2, 0.02]}
        transform
        occlude
        style={{
          width: '140px',
          padding: '8px',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter information"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #00b36b',
              borderRadius: '4px',
              padding: '6px',
              color: '#ffffff',
              width: '100%',
              outline: 'none',
              fontSize: '0.9em',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="submit"
              style={{
                background: '#00b36b',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 6px',
                color: '#000000',
                cursor: 'pointer',
                flex: 1,
                fontSize: '0.9em',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#ff0000',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 6px',
                color: '#ffffff',
                cursor: 'pointer',
                flex: 1,
                fontSize: '0.9em',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Html>
    </group>
  )
}

function DayNumber({ day, position, isSelected, dateInfo }) {
  const textRef = useRef()
  
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })
  
  return (
    <group>
      {!dateInfo && (  // Only show the original date number if there's no content
        <Text
          ref={textRef}
          position={position}
          fontSize={0.3}
          color={isSelected ? "#000000" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Bold.ttf"
        >
          {day}
        </Text>
      )}
      {dateInfo && (
        <group position={[position[0], 0, position[2]]}>
          <Text
            position={[-0.8, 0, 0]}
            fontSize={0.15}
            color="#ff4444"
            anchorX="right"
            anchorY="middle"
            renderOrder={1}
          >
            {day}
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            maxWidth={1.5}
            textAlign="left"
            renderOrder={1}
          >
            {dateInfo}
          </Text>
        </group>
      )}
    </group>
  )
}

function DayNumbers({ selectedMonth, selectedDay, habits }) {
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
        
        // Find habit for this day
        const habitForDay = habits.find(h => 
          h.date === new Date(new Date().getFullYear(), selectedMonth, day).toISOString().split('T')[0]
        )
        
        return (
          <DayNumber 
            key={day}
            day={day}
            position={[x, 0, z]}
            isSelected={day === selectedDay}
            dateInfo={habitForDay?.content || null}
          />
        )
      })}
    </>
  )
}

function CameraController({ targetDay, selectedMonth, isFreeSpin }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    if (!isFreeSpin && targetDay !== null && controlsRef.current) {
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate()
      const angle = ((targetDay - 1) / daysInMonth) * Math.PI * 2
      const radius = 8
      const targetX = Math.cos(angle) * radius
      const targetZ = Math.sin(angle) * radius
      
      const targetPosition = new THREE.Vector3(targetX, 0, targetZ)
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(0, 0, 0)
    }
  })

  return <OrbitControls 
    ref={controlsRef} 
    enableZoom={true} 
    enablePan={true} 
    enableRotate={true}
    autoRotate={isFreeSpin}
    autoRotateSpeed={1}
  />
}

export function HabitScheduler() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [targetDay, setTargetDay] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [dateInfo, setDateInfo] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isFreeSpin, setIsFreeSpin] = useState(true)
  const [habits, setHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Fetch habits for the selected month
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const year = new Date().getFullYear()
        const startDate = new Date(year, selectedMonth, 1).toISOString().split('T')[0]
        const endDate = new Date(year, selectedMonth + 1, 0).toISOString().split('T')[0]
        
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true })
        
        if (error) throw error
        
        setHabits(data || [])
      } catch (err) {
        console.error('Error fetching habits:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHabits()
  }, [selectedMonth])

  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear()
    return new Date(year, month + 1, 0).getDate()
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value))
    setTargetDay(null)
    setSelectedDay(null)
    setDateInfo('')
    setIsEditing(false)
    setIsFreeSpin(true)
  }

  const handleDayClick = (day) => {
    console.log('Day clicked:', day)
    setTargetDay(day)
    setSelectedDay(day)
    
    // Find existing habit for this day
    const date = new Date(new Date().getFullYear(), selectedMonth, day).toISOString().split('T')[0]
    const existingHabit = habits.find(h => h.date === date)
    setDateInfo(existingHabit?.content || '')
    
    setIsEditing(true)
    setIsFreeSpin(false)
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    
    if (!dateInfo.trim()) {
      setIsEditing(false)
      return
    }

    try {
      const date = new Date(new Date().getFullYear(), selectedMonth, selectedDay).toISOString().split('T')[0]
      const existingHabit = habits.find(h => h.date === date)
      
      if (existingHabit) {
        // Update existing habit
        const { error } = await supabase
          .from('habits')
          .update({ content: dateInfo })
          .eq('id', existingHabit.id)
        
        if (error) throw error
        
        setHabits(habits.map(h => 
          h.id === existingHabit.id ? { ...h, content: dateInfo } : h
        ))
      } else {
        // Create new habit
        const { data, error } = await supabase
          .from('habits')
          .insert([{
            date,
            month: selectedMonth,
            year: new Date().getFullYear(),
            content: dateInfo
          }])
          .select()
        
        if (error) throw error
        
        setHabits([...habits, data[0]])
      }
      
      setIsEditing(false)
    } catch (err) {
      console.error('Error saving habit:', err)
      setError(err.message)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleFreeSpin = () => {
    setIsFreeSpin(true)
    setTargetDay(null)
    setSelectedDay(null)
    setIsEditing(false)
  }

  return (
    <>
      <Stars />
      <div className="habit-scheduler-page">
        <h1 className="title">Habit Scheduler</h1>
        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        <div className="month-selector">
          <label htmlFor="month">Select Month:</label>
          <select 
            id="month" 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="month-dropdown"
            disabled={isLoading}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        
        <div className="canvas-container">
          <button 
            className={`free-spin-button ${isFreeSpin ? 'active' : ''}`}
            onClick={handleFreeSpin}
            title="Toggle free spin mode"
            disabled={isLoading}
          >
            {isFreeSpin ? '⏸' : '▶'}
          </button>
          <div className={`date-input-container ${isEditing ? 'visible' : ''}`}>
            <form onSubmit={handleSaveInfo} className="date-input-form">
              <input
                type="text"
                value={dateInfo}
                onChange={(e) => setDateInfo(e.target.value)}
                placeholder="Enter information for this date"
                className="date-input"
                autoFocus
                disabled={isLoading}
              />
              <div className="date-input-buttons">
                <button type="submit" className="date-input-save" disabled={isLoading}>
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  className="date-input-cancel"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Planet />
            <Ring />
            <DayNumbers 
              selectedMonth={selectedMonth} 
              selectedDay={selectedDay}
              habits={habits}
            />
            <CameraController 
              targetDay={targetDay} 
              selectedMonth={selectedMonth}
              isFreeSpin={isFreeSpin}
            />
          </Canvas>
        </div>
        
        <div className="day-squares-container">
          {Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => {
            const day = i + 1
            const date = new Date(new Date().getFullYear(), selectedMonth, day).toISOString().split('T')[0]
            const hasHabit = habits.some(h => h.date === date)
            
            return (
              <div 
                key={day} 
                className={`day-square ${selectedDay === day ? 'selected' : ''} ${hasHabit ? 'has-habit' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}