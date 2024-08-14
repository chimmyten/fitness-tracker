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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchWorkouts, deleteWorkout } from "../api/workoutsApi";

export default function WorkoutsTable({ selectedTab }) {
  const [workouts, setWorkouts] = useState([]);
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

  const workoutType = workoutTypeMap(selectedTab);

  useEffect(() => {
    const getWorkouts = async (workoutType) => {
      try {
        const workouts = await fetchWorkouts(workoutType);
        setWorkouts(workouts);
      } catch (error) {
        console.error(`Failed to fetch workouts: ${error}`);
      }
    };

    setWorkouts(getWorkouts(workoutType));
  }, [workoutType]);

  // console.log(workouts);

  const handleDelete = async (workoutId) => {
    console.log(workoutId);
    deleteWorkout(workoutId);
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
        return workouts.map((workout) => (
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
    // <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
    //   {workouts.map((workout) => {
    //     return (
    //       <Card
    //         key={workout._id}
    //         variant="outlined"
    //         sx={{ boxShadow: 2, pr: 1.5, transition: "transform 0.3s", "&:hover": { transform: "scale(1.025)" }, position: "relative" }}
    //       >
    //         <Box sx={{ position: "absolute", top: -5, right: -5}}>
    // <IconButton variant="outlined" onClick={() => {handleDelete(workout._id)}}>
    //   <DeleteIcon />
    // </IconButton>
    //         </Box>
    //         {card(workout)}
    //       </Card>
    //     );
    //   })}
    // </Box>
    <>
      {workouts.length > 0 ? (
        <Box>
          <TableContainer component={Paper}>
            <Table>
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
