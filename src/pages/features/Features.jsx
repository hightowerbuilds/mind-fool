import { Link } from '@tanstack/react-router'
import { Stars } from '../../components/Stars/Stars'
import './Features.css'
import '../../styles/global.css'

export function Features() {
  return (
    <>
      <Stars />
      <div className="features-page">
        <h1 className="features-title">Features</h1>
        <ul className="features-list">
          <li>
            <Link to="/habit-locator" className="feature-link">
              Habit Locator
            </Link>
          </li>
          <li>
            <Link to="/habit-prioritizer" className="feature-link">
              Habit Prioritizer
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
} 