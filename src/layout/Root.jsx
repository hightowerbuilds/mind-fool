import { Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import './Root.css'
import '../styles/global.css'

export function Root() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="root">
      <nav className="nav">
        <div className="nav-left">
          <button 
            className="menu-button" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? '>>>' : '|||'}
          </button>
          <h1 className="nav-title">mind fool</h1>
        </div>
        {isOpen && (
          <div className="dropdown-menu">
            <Link 
              to="/" 
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
          </div>
        )}
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
} 