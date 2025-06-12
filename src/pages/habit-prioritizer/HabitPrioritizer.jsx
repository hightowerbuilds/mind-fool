import { useState, useRef, useEffect } from 'react'
import './HabitPrioritizer.css'
import '../../styles/global.css'

export function HabitPrioritizer() {
  const [habits, setHabits] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    priority: 5,
    intensity: 'daily'
  })
  const sliderRef = useRef(null)
  const [error, setError] = useState('')

  const updateSliderGradient = () => {
    if (sliderRef.current) {
      const value = sliderRef.current.value;
      const percentage = (value - 1) / 9; // Convert 1-10 to 0-1
      sliderRef.current.style.background = `linear-gradient(to right, var(--neon-red) ${percentage * 100}%, var(--neon-blue) ${percentage * 100}%)`;
    }
  };

  useEffect(() => {
    updateSliderGradient(formData.priority)
  }, [formData.priority])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter a habit name');
      return;
    }

    // Add new habit
    const newHabit = {
      id: Date.now(),
      name: formData.name,
      priority: formData.priority,
      createdAt: new Date().toISOString()
    };

    setHabits(prevHabits => [...prevHabits, newHabit]);
    setFormData({ name: '', priority: 5 });
    setError('');

    // Trigger vibration if supported (100ms duration)
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }

  const handleDelete = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id))
  }

  return (
    <div className="habit-prioritizer-page">
      <h1 className="title">Habit Prioritizer</h1>
      
      <form onSubmit={handleSubmit} className="habit-form">
        <div className="form-group">
          <label htmlFor="name">Habit Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter a new habit"
            className={error ? 'error' : ''}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority (1-10):</label>
          <input
            ref={sliderRef}
            type="range"
            id="priority"
            name="priority"
            min="1"
            max="10"
            value={formData.priority}
            onChange={handleInputChange}
          />
          <span className="priority-value">{formData.priority}</span>
        </div>

        <div className="form-group">
          <label htmlFor="intensity">Intensity:</label>
          <select
            id="intensity"
            name="intensity"
            value={formData.intensity}
            onChange={handleInputChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Add Habit</button>
      </form>

      <div className="habits-list">
        <h2>Your Habits</h2>
        {habits.length === 0 ? (
          <p className="no-habits">No habits added yet</p>
        ) : (
          <ul>
            {habits.map(habit => (
              <li key={habit.id} className="habit-item">
                <div className="habit-info">
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-priority">Priority: {habit.priority}</span>
                  <span className="habit-intensity">{habit.intensity}</span>
                </div>
                <button 
                  onClick={() => handleDelete(habit.id)}
                  className="delete-button"
                  aria-label="Delete habit"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 