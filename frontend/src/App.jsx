import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutsTable from "./components/WorkoutsTable";
import { fetchWorkouts } from "./api/workoutsApi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

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

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ backgroundColor: "#fff" }}>
        <h1>Fitness Tracker</h1>
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab name="type" label="Run" />
          <Tab name="type" label="Weights" />
        </Tabs>
        <WorkoutForm selectedTab={selectedTab}/>
        <Box>
          <Box sx={{ fontSize: "1.6rem", marginBottom: 1.8 }}>Recently Added Workouts</Box>
          {workouts.length > 0 ? <WorkoutsTable workouts={workouts} /> : <p>Getting workout history...</p>}
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default App;
