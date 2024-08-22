import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Select,
  FormControl,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteWorkout } from "../api/workoutsApi";
import dayjs from "dayjs";

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

function WorkoutDetails({ selectedWorkout }) {
  return (
    <Box component={Paper} sx={{ minWidth: "150px", maxWidth: "250px", maxHeight: "75px", padding: 2 }}>
      <Box sx={{ fontWeight: "bold" }}>Details:</Box>
      <Box sx={{ whiteSpace: "pre-line" }}>{selectedWorkout.details}</Box>
    </Box>
  );
}

function EditWorkoutModal({ open, setOpen, selectedWorkout, handleSave }) {
  const [editedWorkout, setEditedWorkout] = useState(selectedWorkout);

  useEffect(() => {
    setEditedWorkout(selectedWorkout);
  }, [selectedWorkout]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setEditedWorkout(selectedWorkout);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <DatePicker
          name="date"
          defaultValue={editedWorkout.date ? dayjs(editedWorkout.date, "MM/DD/YYYY") : null}
          onChange={(newValue) => {
            setEditedWorkout({ ...editedWorkout, date: newValue });
          }}
          sx={{ marginTop: 1 }}
        />
        <Box sx={{ display: "flex", gap: 3 }}>
          <TextField
            value={editedWorkout.distance || ""}
            name="distance"
            label="Distance (e.g. 1mi)"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            sx={{ maxWidth: "300px" }}
          />
          <TextField
            value={editedWorkout.duration || ""}
            name="duration"
            label="Time (hh:mm:ss)"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            sx={{ maxWidth: "300px" }}
          />
        </Box>
        <TextField
          value={editedWorkout.details || ""}
          name="details"
          label="Details"
          variant="outlined"
          multiline
          margin="normal"
          fullWidth
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function WorkoutsTable({ workouts, workoutType, loadingWorkouts }) {
  const [displayedWorkouts, setDisplayedWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (Array.isArray(workouts)) {
      setDisplayedWorkouts(workouts);
    } else {
      setDisplayedWorkouts([]); // Fallback to an empty array if workouts is not an array
    }
  }, [workouts]);

  useEffect(() => {
    setSelectedWorkout(null);
  }, [workoutType]);

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

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDelete = async (workoutId) => {
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
            field: "edit",
            headerName: "Edit",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleEdit(params.row._id);
                }}
              >
                <EditIcon />
              </IconButton>
            ),
          },
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
            field: "edit",
            headerName: "Edit",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleEdit(params.row._id);
                }}
              >
                <EditIcon />
              </IconButton>
            ),
          },
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
            field: "edit",
            headerName: "Edit",
            flex: 0.5,
            renderCell: (params) => (
              <IconButton
                variant="outlined"
                onClick={() => {
                  handleEdit(params.row._id);
                }}
              >
                <EditIcon />
              </IconButton>
            ),
          },
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

  const handleSelectionChange = (newSelection) => {
    setSelectedWorkout(displayedWorkouts.find((workout) => workout._id === newSelection[0]));
  };

  return (
    <>
      {!loadingWorkouts ? (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <TableFilters workoutType={workoutType} sortDisplayedWorkouts={sortDisplayedWorkouts} />
            {selectedWorkout !== null && selectedWorkout !== undefined && (
              <WorkoutDetails selectedWorkout={selectedWorkout} />
            )}
          </Box>
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
            disableMultipleRowSelection={true}
            onRowSelectionModelChange={handleSelectionChange}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      ) : (
        <Box>Getting workouts history...</Box>
      )}
      {selectedWorkout && (
        <EditWorkoutModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          selectedWorkout={selectedWorkout}
        />
      )}
    </>
  );
}
