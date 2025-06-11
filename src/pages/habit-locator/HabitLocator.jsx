import { useEffect } from 'react'
import { Map } from '../../components/Map/Map'
import './HabitLocator.css'
import '../../styles/global.css'

export function HabitLocator() {
  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="habit-locator-page">
      <h1 className="habit-locator-title">Habit Locator</h1>
    
      <div className="map-section">
        <Map />
      </div>
    </div>
  )
} 