import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutsTable from "./components/WorkoutsTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchWorkouts } from "./api/workoutsApi";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [workoutAdded, setWorkoutAdded] = useState(false);

  const workoutTypeMap = (num) => {
    switch (num) {
      case 0:
        return "Run";

      case 1:
        return "Weights";

      default:
        return "Run";
    }
  };


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const getWorkouts = async (workoutType) => {
      setLoadingWorkouts(true);
      try {
        const fetchedWorkouts = await fetchWorkouts(workoutType);
        setWorkouts(fetchedWorkouts);
      } catch (error) {
        console.error(`Failed to fetch workouts: ${error}`);
      }
      setLoadingWorkouts(false);
      setWorkoutAdded(false);
    };

    setWorkouts(getWorkouts(workoutTypeMap(selectedTab)));
  }, [selectedTab, workoutAdded]);

  const handleWorkoutAdded = () => {
    setWorkoutAdded(true);
  }

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ backgroundColor: "#fff" }}>
        <h1>Fitness Tracker</h1>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab name="type" label="Run" />
          <Tab name="type" label="Weights" />
        </Tabs>
        <WorkoutForm selectedTab={selectedTab} handleWorkoutAdded={handleWorkoutAdded}/>
        <Box>
          <Box sx={{ fontSize: "1.6rem", marginBottom: 1.8 }}>Workout Logs</Box>
           <WorkoutsTable workouts={workouts} workoutType={workoutTypeMap(selectedTab)} loadingWorkouts={loadingWorkouts} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default App;
