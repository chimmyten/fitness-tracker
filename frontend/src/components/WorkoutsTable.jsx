import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteWorkout } from "../api/workoutsApi";

function TableFilters(props) {
  const { workoutType, sortDisplayedWorkouts } = props;
  const [sortCriteria, setSortCriteria] = useState("");

  const menuOptions = {
    Run: [
      { value: "distance desc", label: "Distance \u2193" },
      { value: "distance asc", label: "Distance \u2191" },
      { value: "duration desc", label: "Duration \u2193" },
      { value: "duration asc", label: "Duration \u2191" },
    ],
    Weights: [
      { value: "duration desc", label: "Duration \u2193" },
      { value: "duration asc", label: "Duration \u2191" },
    ],
  };

  const menuItems = menuOptions[workoutType] || [];
  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortCriteria(sortValue);
    const field = sortValue.split(" ")[0];
    const order = sortValue.split(" ")[1];
    sortDisplayedWorkouts(field, order);
  };

  return (
    <Box component={Paper} sx={{ minWidth: "150px", maxHeight: "75px", padding: 2 }}>
      <FormControl sx={{ display: "flex" }}>
        <Box fontSize="15px">Sort By</Box>
        <Select value={sortCriteria} onChange={handleSortChange} sx={{ fontSize: "15px" }}>
          <MenuItem value="date desc" sx={{ fontSize: "15px" }}>
            Date &darr;
          </MenuItem>
          <MenuItem value="date asc" sx={{ fontSize: "15px" }}>
            Date &uarr;
          </MenuItem>
          {menuItems.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: "15px" }}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}

export default function WorkoutsTable({ workouts, workoutType, loadingWorkouts }) {
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);

  useEffect(() => {
    if (Array.isArray(workouts)) {
      setDisplayedWorkouts(workouts);
    } else {
      setDisplayedWorkouts([]); // Fallback to an empty array if workouts is not an array
    }
  }, [workouts]);

  const extractNumeric = (str) => {
    const match = str.match(/^(\d+)(.*)$/);
    let numeric = match ? match[1] : 0;
    const units = match ? match[2] : "";
    numeric = units === "hr" ? numeric * 60 : numeric;
    return numeric;
  };

  const sortDisplayedWorkouts = 
    (field, order) => {
      const updatedWorkouts = [...displayedWorkouts];

      if (field === "date") {
        updatedWorkouts.sort((a, b) => {
          if (order === "asc") {
            return new Date(a[field]) - new Date(b[field]);
          } else {
            return new Date(b[field]) - new Date(a[field]);
          }
        });
      } else {
        updatedWorkouts.sort((a, b) => {
          if (order === "asc") {
            return extractNumeric(a[field]) - extractNumeric(b[field]);
          } else {
            return extractNumeric(a[field]) - extractNumeric(b[field]);
          }
        });
      }

      setDisplayedWorkouts(updatedWorkouts);
    }

  const handleDelete = async (workoutId) => {
    console.log(workoutId);
    await deleteWorkout(workoutId);

    const deleted_index = workouts.findIndex((workout) => workout._id === workoutId);
    if (deleted_index !== -1) {
      const updatedWorkouts = displayedWorkouts.filter((workout) => workout._id !== workoutId);
      setDisplayedWorkouts(updatedWorkouts);
    }
  };

  console.log(displayedWorkouts);

  const tableHeaders = (workoutType) => {
    switch (workoutType) {
      case "Run":
        return (
          <TableRow>
            <TableCell sx={{fontWeight: "Bold"}}>Date</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Distance</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Duration</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Delete</TableCell>
          </TableRow>
        );
      case "Weights":
        return (
          <TableRow>
            <TableCell sx={{fontWeight: "Bold"}}>Date</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Muscles</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Duration</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Delete</TableCell>
          </TableRow>
        );
      default:
        return (
          <TableRow>
            <TableCell sx={{fontWeight: "Bold"}}>Date</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Type</TableCell>
            <TableCell align="right" sx={{fontWeight: "Bold"}}>Delete</TableCell>
          </TableRow>
        );
    }
  };

  const tableRows = (workoutType) => {
    switch (workoutType) {
      case "Run":
        return displayedWorkouts.map((workout) => (
          <TableRow key={workout._id}>
            <TableCell>{workout.date}</TableCell>
            <TableCell align="right">{workout.distance}</TableCell>
            <TableCell align="right">{workout.duration}</TableCell>
            <TableCell align="right">
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleDelete(workout._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ));
      case "Weights":
        return displayedWorkouts.map((workout) => (
          <TableRow key={workout._id}>
            <TableCell>{workout.date}</TableCell>
            <TableCell align="right">{workout.muscles}</TableCell>
            <TableCell align="right">{workout.duration}</TableCell>
            <TableCell align="right">
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleDelete(workout._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ));
    }
  };

  return (
    <>
      {!loadingWorkouts ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <TableFilters workoutType={workoutType} sortDisplayedWorkouts={sortDisplayedWorkouts} />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>{tableHeaders(workoutType)}</TableHead>
              <TableBody>{tableRows(workoutType)}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Getting workouts history...</Box>
      )}
    </>
  );
}
