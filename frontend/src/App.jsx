import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutsTable from "./components/WorkoutsTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);


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
          <Box sx={{ fontSize: "1.6rem", marginBottom: 1.8 }}>Workout Logs</Box>
           <WorkoutsTable selectedTab={selectedTab} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default App;
