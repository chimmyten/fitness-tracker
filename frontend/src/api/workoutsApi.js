const fetchWorkouts = async (workoutType) => {
  const queryParams = new URLSearchParams({
    type: workoutType,
  });
  const queryParamString = queryParams.toString();
  try {
    const response = await fetch(`http://127.0.0.1:8000/workouts?${queryParamString}`);

    if (response.ok) {
      console.log(`${workoutType} workouts fetched`);
      const data = await response.json();
      return data;
    } else {
      console.error(`Error fetching ${workoutType} workouts`);
    }
  } catch (error) {
    console.error(`Error fetching ${workoutType} workouts: ${error}`);
  }
};

const postWorkout = async (formData) => {
  formData.date = formData.date !== null ? formData.date.format("MM/DD/YYYY") : "";
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
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Workout ${workoutId} deleted`);
    } else {
      console.error(`Failed to delete workout ${workoutId}`);
    }
  } catch (error) {
    console.error(`Failed to delete workout ${workoutId}`);
  }
};

const updateWorkout = async (updatedWorkout) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/workouts/${updatedWorkout._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWorkout),
    });
    if (!response.ok) {
      throw new Error(`Failed to update workout: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(`${data.message}`);
  } catch (error) {
    console.error(`Failed to update workout ${updatedWorkout._id}: ${error.message}`);
  }
};

const createUser = async (user) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
  }
};

const authenticateUser = async (user) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Failed to authenticate user: ${error}`);
  }
}

export { fetchWorkouts, postWorkout, deleteWorkout, updateWorkout, createUser, authenticateUser };
