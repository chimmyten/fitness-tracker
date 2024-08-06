import { useState, useEffect } from 'react'
import { Tabs, Tab, Box, TextField, Button, Card, CardContent, Typography } from '@mui/material';

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
    <Box marginBottom={2}>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Run" />
        <Tab label="Weights" />
      </Tabs>
      <Box marginTop={1}>
        {renderForm()}
      </Box>
    </Box>
  );
}

function WorkoutCard({ workout }) {

  const dateAndType = `${workout.date} ${workout.type}`

  const card = (workout) => {
    switch(workout.type){
      case "Run":
        return (
          <>
            <CardContent>
              <Typography sx={{fontSize: 25, fontWeight: "bold", marginBottom: 2}}> 
                {dateAndType}
              </Typography>
              <Typography sx={{marginBottom: 1, fontSize: 20}}>
                Distance: {workout.distance}
              </Typography>
              <Typography sx={{ fontSize: 20}}>
                Duration: {workout.duration}
              </Typography>
            </CardContent>
          </>
        )
      case "Weights":
        <>
          <CardContent>
            <Typography sx={{fontSize: 20, fontWeight: "bold", marginBottom: 2}}> 
              {dateAndType}
            </Typography>
            <Typography sx={{marginBottom: 1, fontSize: 20}}>
              Exercises: {workout.exercises}
            </Typography>
            <Button size="small">Details</Button>
          </CardContent>
        </>
    }
  }

  return (
    <Box sx={{ display: 'inline-block', minWidth: '225px'}}>
      <Card variant="outlined">
        {card(workout)}
      </Card>
    </Box>
  )
}

export default App
