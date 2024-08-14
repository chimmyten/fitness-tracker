import { Box, Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteWorkout } from "../api/workoutsApi";

export default function WorkoutCards({ workouts }) {
  const handleDelete = async (workoutId) => {
    console.log(workoutId);
    deleteWorkout(workoutId)
  }
  const card = (workout) => {
    const dateAndType = `${workout.date} ${workout.type}`;

    switch (workout.type) {
      case "Run":
        return (
          <>
            <CardContent>
              <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 2 }}>{dateAndType}</Typography>
              <Typography sx={{ marginBottom: 1, fontSize: 18, color: "text.secondary" }}>
                Distance: {workout.distance}
              </Typography>
              <Typography sx={{ fontSize: 18, color: "text.secondary" }}>Duration: {workout.duration}</Typography>
            </CardContent>
          </>
        );
      case "Weights":
        return (
          <>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: "bold", marginBottom: 2 }}>{dateAndType}</Typography>
              <Typography sx={{ marginBottom: 1, fontSize: 18, color: "text.secondary" }}>
                Exercises: {workout.exercises}
              </Typography>
              <Button size="small">Details</Button>
            </CardContent>
          </>
        );
      default:
        return (
          <>
            <CardContent>
              <Typography sx={{ fontSize: 20, fontWeight: "bold", marginBottom: 2 }}>{dateAndType}</Typography>
              <Typography sx={{ marginBottom: 1, fontSize: 18, color: "text.secondary" }}>
                Details not available
              </Typography>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
      {workouts.map((workout) => {
        return (
          <Card
            key={workout._id}
            variant="outlined"
            sx={{ boxShadow: 2, pr: 1.5, transition: "transform 0.3s", "&:hover": { transform: "scale(1.025)" }, position: "relative" }}
          >
            <Box sx={{ position: "absolute", top: -5, right: -5}}>
              <IconButton variant="outlined" onClick={() => {handleDelete(workout._id)}}>
                <DeleteIcon />
              </IconButton>
            </Box>
            {card(workout)}
          </Card>
        );
      })}
    </Box>
  );
}
