import { useState, useEffect } from 'react'
import { Box } from '@mui/material';
import WorkoutForm from './components/WorkoutForm';
import WorkoutCards from './components/WorkoutCards';
import { fetchWorkouts } from './api/workoutsApi';

function App() {

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const getWorkouts = async () => {
      try{
        const workouts = await fetchWorkouts();
        setWorkouts(workouts);
      } catch (error) {
        console.error(`Failed to fetch workouts: ${error}`)
      }
    }

    getWorkouts()
  }, [])

  return (
    <>
      <h1>Fitness Tracker</h1>
      <WorkoutForm />
      <Box>
      <Box sx={{fontSize: '1.6rem', marginBottom: 1.8}}>
        Recent Workouts
      </Box>
      {workouts.length > 0 ? (
        <WorkoutCards workout={workouts[0]}/>
        ) : (
          <p>Getting workout history...</p>
        )
      }
      </Box>
      
    </>
  )
}

export default App
