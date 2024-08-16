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
  const { workoutType } = props;
  const [sortCriteria, setSortCriteria] = useState("date desc");

  const menuOptions = {
    "Run": [
      {value: "distance", label: "Distance"},
      {value: "duration", label: "Duration"}
    ],
    "Weights": [
      {value: "duration", label: "Duration"}
    ]
  }

  const menuItems = menuOptions[workoutType] || [];
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  console.log(sortCriteria);
  return (
    <Box component={Paper} sx={{ minWidth: "150px", maxHeight: "75px", padding: 2 }}>
      <FormControl sx={{ display: "flex" }}>
        <Box fontSize="15px">Sort By</Box>
        <Select value={sortCriteria} onChange={handleSortChange} sx={{ fontSize: "15px"}}>
          <MenuItem value="date desc">
            Date &darr;
          </MenuItem>
          <MenuItem value="date asc">
            Date &uarr;
          </MenuItem>
          {menuItems.map((option) => {
            return <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
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

  const handleDelete = async (workoutId) => {
    console.log(workoutId);
    await deleteWorkout(workoutId);

    const deleted_index = workouts.findIndex((workout) => workout._id === workoutId);
    if (deleted_index !== -1) {
      const updatedWorkouts = displayedWorkouts.filter((workout) => workout._id !== workoutId);
      setDisplayedWorkouts(updatedWorkouts);
    }
  };

  const tableHeaders = (workoutType) => {
    switch (workoutType) {
      case "Run":
        return (
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Distance</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        );
      case "Weights":
        return (
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Muscles</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        );
      default:
        return (
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Delete</TableCell>
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
        return workouts.map((workout) => (
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
          <TableFilters workoutType={workoutType} />
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
