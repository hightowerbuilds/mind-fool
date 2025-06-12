import './Home.css'
import '../../styles/global.css'
import { Scene3D } from '../../components/Scene3D/Scene3D'

export function Home() {
  return (
    <div className="home-page">
      <Scene3D />
      <h1 className="home-title">mind fool</h1>
    </div>
  )
} 