import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export default function WorkoutCards({ workouts }) {
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
            sx={{ boxShadow: 2, pr: 1.5, transition: "transform 0.3s", "&:hover": { transform: "scale(1.025)" } }}
          >
            {card(workout)}
          </Card>
        );
      })}
    </Box>
  );
}
