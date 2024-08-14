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

export { fetchWorkouts, postWorkout };
