import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { postWorkout } from "../api/workoutsApi";
import { useNavigate } from "react-router-dom";

export default function WorkoutForm({ selectedTab, handleWorkoutAdded, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

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

    if (!formData.date) {
      setFormError("Please enter date");
      setFormSuccess(false);
      return;
    }

    const distanceRegex = /^\d+[a-zA-Z]+$/;
    if (formData.distance && !distanceRegex.test(formData.distance)) {
      setFormError("Please enter distance with a number followed by units");
      setFormSuccess(false);
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (formData.duration && !timeRegex.test(formData.duration)) {
      setFormError("Please enter time in hh:mm:ss format");
      setFormSuccess(false);
      return;
    }

    const submission = await postWorkout(formData);

    if (submission !== 401) {
      setFormSuccess(true);
      setFormError("");
    } else {
      if (submission === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
      }
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
                  label="Distance (e.g. 1mi)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleFormChange}
                  sx={{ maxWidth: "300px" }}
                />
                <TextField
                  value={formData.duration}
                  name="duration"
                  label="Time (hh:mm:ss)"
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
                onChange={handleFormChange}
              />
              <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
                  Add Run
                </Button>
                {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
                {formError && <Typography sx={{ color: "red" }}>{formError}</Typography>}
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
                  label="Duration (hh:mm:ss)"
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
                onChange={handleFormChange}
              />
              <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1 }}>
                  Add Weights
                </Button>
                {formSuccess && <Typography sx={{ color: "green" }}>Workout Added!</Typography>}
                {formError && <Typography sx={{ color: "red" }}>{formError}</Typography>}
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
