import { useState } from "react";
import { Tabs, Tab, Box, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function WorkoutForm() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    date: "",
    type: "Run",
  });

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

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setFormData({
      ...formData,
      type: workoutTypeMap(newValue),
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);

  const renderForm = () => {
    switch (selectedTab) {
      case 0:
        return (
          <form>
            <DatePicker
              name="date"
              onChange={(newValue) => {
                setFormData({ ...formData, date: newValue.format("YYYY-MM-DD") });
              }}
              sx={{ marginTop: 1 }}
            />
            <TextField
              name="distance"
              label="Distance (km)"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <TextField
              name="duration"
              label="Time (minutes)"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <Button variant="contained" color="primary">
              Add Run
            </Button>
          </form>
        );
      case 1:
        return (
          <form>
            <DatePicker name="date"
              onChange={(newValue) => {
                setFormData({ ...formData, date: newValue.format("YYYY-MM-DD") });
              }}
              sx={{ marginTop: 1 }} />
            <TextField
              name="muscles"
              label="Muscles"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <TextField
              name="duration"
              label="Duration"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <Button variant="contained" color="primary">
              Add Weights
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Box marginBottom={2}>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab name="type" label="Run" />
        <Tab name="type" label="Weights" />
      </Tabs>
      <Box marginTop={1}>{renderForm()}</Box>
    </Box>
  );
}
