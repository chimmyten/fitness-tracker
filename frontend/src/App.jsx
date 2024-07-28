import { useState, useEffect } from 'react'
import { Tabs, Tab, Box, TextField, Button } from '@mui/material';

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
      <WorkoutForm />
      {workouts.length > 0 ? (
        <WorkoutCard workout={workouts[0]}/>
      ) : (
        <p>Getting workout history...</p>
      )
      }
    </>
  )
}

function WorkoutForm() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderForm = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Box>
            <TextField label="Distance (km)" variant="outlined" fullWidth margin="normal" />
            <TextField label="Time (minutes)" variant="outlined" fullWidth margin="normal" />
            <Button variant="contained" color="primary">Add Run</Button>
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField label="Exercise" variant="outlined" fullWidth margin="normal" />
            <TextField label="Sets" variant="outlined" fullWidth margin="normal" />
            <TextField label="Reps" variant="outlined" fullWidth margin="normal" />
            <Button variant="contained" color="primary">Add Weights</Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Run" />
        <Tab label="Weights" />
      </Tabs>
      <Box marginTop={2}>
        {renderForm()}
      </Box>
    </Box>
  );
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
