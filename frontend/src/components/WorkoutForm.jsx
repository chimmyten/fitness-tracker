import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { postWorkout } from "../api/workoutsApi";

export default function WorkoutForm({ selectedTab, handleWorkoutAdded }) {
  const [formSuccess, setFormSuccess] = useState(false);

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

  const [formData, setFormData] = useState({
    date: null,
    type: workoutTypeMap(selectedTab),
    distance: "",
    muscles: "",
    duration: "",
    details: "",
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: workoutTypeMap(selectedTab),
    }));
  }, [selectedTab]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submission = postWorkout(formData);

    if (submission) {
      setFormSuccess(true);
    } else {
      setFormSuccess(false);
    }
    handleWorkoutAdded();
    // clear the form fields
    setFormData((prevFormData) => {
      const clearedData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = key === "type" ? prevFormData[key] : ""; // Keep 'type' unchanged
        if (key === "date") {
          acc[key] = null;
        }
        return acc;
      }, {});
      return clearedData;
    });
  };
  const renderForm = () => {
    switch (selectedTab) {
      case 0:
        return (
          <form onSubmit={handleSubmit}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <DatePicker
                value={formData.date}
                name="date"
                onChange={(newValue) => {
                  setFormData({ ...formData, date: newValue });
                }}
                sx={{ marginTop: 1 }}
              />
              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  value={formData.distance}
                  name="distance"
                  label="Distance"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleFormChange}
                  sx={{ maxWidth: "300px" }}
                />
                <TextField
                  value={formData.duration}
                  name="duration"
                  label="Time"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleFormChange}
                  sx={{ maxWidth: "300px" }}
                />
              </Box>
              <TextField 
                value={formData.details}
                name="details"
                label="Details"
                variant="outlined"
                multiline
                margin="normal"
                fullWidth
                onChange={handleFormChange}/>
              <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button type="submit" variant="contained" color="primary" sx={{marginTop: 1}}>
                  Add Run
                </Button>
                {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
              </Box>
            </Paper>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handleSubmit}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <DatePicker
                value={formData.date}
                name="date"
                onChange={(newValue) => {
                  setFormData({ ...formData, date: newValue });
                }}
                sx={{ marginTop: 1 }}
              />
              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  value={formData.muscles}
                  name="muscles"
                  label="Muscles"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleFormChange}
                  sx={{ maxWidth: "400px" }}
                />
                <TextField
                  value={formData.duration}
                  name="duration"
                  label="Duration"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleFormChange}
                  sx={{ maxWidth: "300px" }}
                />
              </Box>
              <TextField 
                value={formData.details}
                name="details"
                label="Details (Exercises, sets/reps, weight)"
                variant="outlined"
                multiline
                margin="normal"
                fullWidth
                onChange={handleFormChange}/>
              <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1}}>
                  Add Weights
                </Button>
                {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
              </Box>
            </Paper>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Box marginBottom={2}>
      <Box marginTop={1}>{renderForm()}</Box>
    </Box>
  );
}
