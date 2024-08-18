import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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

  const sortDisplayedWorkouts = (field, order) => {
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
  };

  const handleDelete = async (workoutId) => {
    console.log(workoutId);
    await deleteWorkout(workoutId);

    const deleted_index = workouts.findIndex((workout) => workout._id === workoutId);
    if (deleted_index !== -1) {
      const updatedWorkouts = displayedWorkouts.filter((workout) => workout._id !== workoutId);
      setDisplayedWorkouts(updatedWorkouts);
    }
  };

  const columns = (workoutType) => {
    switch (workoutType) {
      case "Run":
        return [
          { field: "date", headerName: "Date", flex: 1 },
          { field: "distance", headerName: "Distance", flex: 1 },
          { field: "duration", headerName: "Duration", flex: 1 },
          {
            field: "delete",
            headerName: "Delete",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleDelete(params.row._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
        ];
      case "Weights":
        return [
          { field: "date", headerName: "Date", flex: 1 },
          { field: "muscles", headerName: "Muscles", flex: 1 },
          { field: "duration", headerName: "Duration", flex: 1 },
          {
            field: "delete",
            headerName: "Delete",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleDelete(params.row._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
        ];
      default:
        return [
          { field: "date", headerName: "Date", flex: 1 },
          { field: "type", headerName: "Type", flex: 1 },
          {
            field: "delete",
            headerName: "Delete",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleDelete(params.row._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
          },
        ];
    }
  };

  return (
    <>
      {!loadingWorkouts ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <TableFilters workoutType={workoutType} sortDisplayedWorkouts={sortDisplayedWorkouts} />
          {/* <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>{tableHeaders(workoutType)}</TableHead>
              <TableBody>{tableRows(workoutType)}</TableBody>
            </Table>
          </TableContainer> */}
          <DataGrid
            rows={displayedWorkouts}
            getRowId={(row) => row._id}
            columns={columns(workoutType)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25]}
          />
        </Box>
      ) : (
        <Box>Getting workouts history...</Box>
      )}
    </>
  );
}
