import { useEffect, useRef, useState } from 'react'
import './Map.css'

export function Map() {
  const mapRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      if (!window.google) {
        setError('Google Maps API not loaded')
        return
      }

      // Default to San Francisco if no location is available
      const defaultLocation = { lat: 37.7749, lng: -122.4194 }
      const location = currentLocation || defaultLocation

      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      // Add marker for current location
      new window.google.maps.Marker({
        position: location,
        map,
        title: 'Your Location',
      })
    }

    initMap()
  }, [currentLocation])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })
        setError(null)
      },
      (error) => {
        setError('Unable to retrieve your location')
        console.error('Error getting location:', error)
      }
    )
  }

  return (
    <div className="map-container">
      {error && <div className="map-error">{error}</div>}
      <div ref={mapRef} className="map" />
      <button 
        className="location-button"
        onClick={getCurrentLocation}
      >
        Update My Location
      </button>
    </div>
  )
} 