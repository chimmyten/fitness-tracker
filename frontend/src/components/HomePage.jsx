import { useState, useEffect } from "react";
import { Box, Button, Tabs, Tab, Paper } from "@mui/material";
import WorkoutForm from "./WorkoutForm";
import WorkoutsTable from "./WorkoutsTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchWorkouts } from "../api/workoutsApi";
import { useNavigate } from "react-router-dom";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

function HomePage() {
  const navigate = useNavigate();
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
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ backgroundColor: "#fff" }}>
        <Box
          sx={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginTop: 3,
            marginBottom: 2,
          }}
        >
          Fitness Tracker
        </Box>
        <Button size="large" sx={{ position: "fixed", top: 20, right: 30 }} onClick={handleLogOut}>
          Log Out
        </Button>
        <Paper elevation={3} sx={{ display: "inline-flex" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab name="type" label="Run" />
            <Tab name="type" label="Weights" />
          </Tabs>
        </Paper>
        <WorkoutForm selectedTab={selectedTab} handleWorkoutAdded={handleWorkoutAdded} />
        <Box>
          <Box sx={{ fontSize: "1.8rem", marginBottom: 2, textAlign: "center" }}>
            {workoutTypeMap(selectedTab)} Workouts
          </Box>
          <WorkoutsTable
            workouts={workouts}
            workoutType={workoutTypeMap(selectedTab)}
            loadingWorkouts={loadingWorkouts}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default HomePage;
