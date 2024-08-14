import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutCards from "./components/WorkoutCards";
import { fetchWorkouts } from "./api/workoutsApi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const workouts = await fetchWorkouts();
        setWorkouts(workouts);
      } catch (error) {
        console.error(`Failed to fetch workouts: ${error}`);
      }
    };

    getWorkouts();
  }, []);

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ backgroundColor: "#fff" }}>
        <h1>Fitness Tracker</h1>
        <WorkoutForm />
        <Box>
          <Box sx={{ fontSize: "1.6rem", marginBottom: 1.8 }}>Recently Added Workouts</Box>
          {workouts.length > 0 ? <WorkoutCards workouts={workouts} /> : <p>Getting workout history...</p>}
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default App;
