import { useState } from 'react';
import { Tabs, Tab, Box, TextField, Button } from '@mui/material';


export default function WorkoutForm() {
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