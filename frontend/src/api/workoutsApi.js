const fetchWorkouts = async () => {
  const response = await fetch("http://127.0.0.1:8000/");
  const data = await response.json();
  return data;
};

const postWorkout = async (formData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log("Workout logged successfully");
      return true;
    } else {
      console.error(`Submission Error: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteWorkout = async (workoutId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/${workoutId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      console.log(`Workout ${workoutId} deleted`);
    } else {
      console.error(`Failed to delete workout ${workoutId}`)
    }
  } catch (error) {
    console.error(`Failed to delete workout ${workoutId}`)
  }
}

export { fetchWorkouts, postWorkout, deleteWorkout };
