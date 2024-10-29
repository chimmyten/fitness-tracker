import { Box, Button, TextField, Paper, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { createUser, authenticateUser } from "../api/workoutsApi";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [returningUser, setReturningUser] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [logInProgress, setLogInProgress] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLogInProgress(true);

    if (!formData.username) {
      setFormError("Username required");
      setLogInProgress(false);
      return;
    }
    if (!formData.password) {
      setFormError("Password required");
      setLogInProgress(false);
      return;
    }

    if (!returningUser) {
      if (formData.password !== formData.passwordConfirm) {
        setFormError("Passwords do not match");
        setLogInProgress(false);
        return;
      }

      const result = await createUser(formData);

      if (result === "User created successfully") {
        setFormSuccess(true);
        setFormError("");
        setFormData({
          username: "",
          password: "",
          passwordConfirm: "",
        });
        setLogInProgress(false);
      } else {
        setFormError(result);
        setLogInProgress(false);
      }
      return;
    }

    const result = await authenticateUser(formData);

    if (result.message) {
      setFormError(result.message);
      setLogInProgress(false);
    } else if (result.token) {
      setFormError("");
      setFormData({
        username: "",
        password: "",
        passwordConfirm: "",
      });
      setLogInProgress(false);
      localStorage.setItem("token", result.token);
      setIsAuthenticated(true);
      navigate("/");
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
          position: "relative",
        }}
      >
        <Box component={Paper} sx={{ padding: 2, marginTop: 12, width: 400 }}>
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

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1.5 }}
                  onClick={handleSubmit}
                >
                  {returningUser ? "Log In" : "Register"}
                </Button>
                {logInProgress && <CircularProgress size={25} sx={{ marginTop: 1.5 }} />}
              </Box>
              <Button
                size="small"
                sx={{ marginTop: 1.5 }}
                onClick={() => {
                  setReturningUser(!returningUser);
                  setFormSuccess(false);
                  setFormError("");
                  setFormData({
                    username: "",
                    password: "",
                    passwordConfirm: "",
                  });
                }}
              >
                {returningUser ? "Create an Account" : "Back to Log In"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <Box sx={{ fontSize: 14, textAlign: "center", marginTop: 3 }}>
        Log in may take longer than expected if server is restarting.
      </Box>
      <Box
        sx={{
          fontSize: "12px",
          color: "gray",
          textDecoration: "none",
          textAlign: "center",
          position: "fixed",
          bottom: 10,
          width: "100%",
          paddingBottom: 5,
        }}
      >
        <a href="https://github.com/chimmyten" target="_blank" rel="noopener noreferrer" style={{ color: "gray" }}>
          github.com/chimmyten
        </a>
      </Box>
    </>
  );
}

export default LoginPage;
