import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { postWorkout } from "../api/workoutsApi";

export default function WorkoutForm({ selectedTab }) {
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
    date: "",
    type: workoutTypeMap(selectedTab),
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submission = postWorkout(formData);

    if (submission) {
      setFormSuccess(true);
    } else {
      setFormSuccess(false);
    }
  };

  const renderForm = () => {
    switch (selectedTab) {
      case 0:
        return (
          <form onSubmit={handleSubmit}>
            <DatePicker
              name="date"
              onChange={(newValue) => {
                setFormData({ ...formData, date: newValue.format("YYYY-MM-DD") });
              }}
              sx={{ marginTop: 1 }}
            />
            <TextField
              name="distance"
              label="Distance"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <TextField
              name="duration"
              label="Time"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Add Run
              </Button>
              {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
            </Box>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handleSubmit}>
            <DatePicker
              name="date"
              onChange={(newValue) => {
                setFormData({ ...formData, date: newValue.format("YYYY-MM-DD") });
              }}
              sx={{ marginTop: 1 }}
            />
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
            <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Add Weights
              </Button>
              {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
            </Box>
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
