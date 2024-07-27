import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    const response = await fetch("http://127.0.0.1:8000/")
    const data = await response.json()
    setWorkouts(data)
  }

  return (
    <>
      <h1>Fitness Tracker</h1>
      {workouts.length > 0 ? (
        <WorkoutCard workout={workouts[0]}/>
      ) : (
        <p>Getting workout history...</p>
      )
      }
    </>
  )
}

function WorkoutCard({ workout }) {

  const dateAndType = `${workout.date} ${workout.type}`

  return (
    <div className="workout-card">
      {dateAndType}
      {workout.type == "Run" ? (
        <>
          <p>
            Distance: {workout.distance}
          </p>
          <p>
            Time: {workout.duration}
          </p>
        </> 
      ) :
      (
        <p>
          Exercises: {workout.exercises}
        </p>
      )}
    </div>
  )
}

export default App
