import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { createUser } from "../api/workoutsApi";

function LoginPage() {
  const [returningUser, setReturningUser] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange = (event) => {
    console.log(formData);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!returningUser) {
      if (!formData.username) {
        setFormError("Username required");
        return;
      }
      if (!formData.password) {
        setFormError("Password required");
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setFormError("Passwords do not match");
        return;
      }

      const result = await createUser(formData);
      console.log(result);

      if (result === "User created successfully") {
        setFormSuccess(true);
        setFormError("");
        setFormData({
          username: "",
          password: "",
          passwordConfirm: "",
        });
      } else {
        setFormError(result);
      }
    }
  };

  return (
    <>
      <h1>Fitness Tracker</h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box component={Paper} sx={{ padding: 2, marginTop: 12 }}>
          <h2>{returningUser ? "Log In" : "Register"}</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                value={formData.username}
                name="username"
                label="Username"
                onChange={handleInputChange}
                sx={{ minWidth: "250px" }}
              />
              <TextField
                value={formData.password}
                name="password"
                type="password"
                label="Password"
                onChange={handleInputChange}
              />
              {!returningUser && (
                <TextField
                  value={formData.passwordConfirm}
                  name="passwordConfirm"
                  type="password"
                  label="Confirm Password"
                  onChange={handleInputChange}
                />
              )}
            </Box>
            {formSuccess && <Typography sx={{ color: "green" }}>User created successfully</Typography>}
            {formError && <Typography sx={{ color: "red" }}>{formError}</Typography>}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1.5 }}>
                {returningUser ? "Log In" : "Register"}
              </Button>
              <Button
                size="small"
                sx={{ marginTop: 1.5 }}
                onClick={() => {
                  setReturningUser(!returningUser);
                  setFormSuccess(false);
                  setFormError("");
                }}
              >
                {returningUser ? "Create an Account" : "Back to Log In"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default LoginPage;
