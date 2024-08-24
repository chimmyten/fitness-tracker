import { Box, Button, TextField, Paper } from "@mui/material";
import { useState } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    console.log(formData);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
          <h2>Login</h2>
          <form>
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
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 1.5 }}>
              Log In
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default LoginPage;
