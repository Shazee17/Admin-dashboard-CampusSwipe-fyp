import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material";
import { tokens } from '../../theme';
import Logo from '../global/Logo';

const SignIn = ({ onLogin }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(formData); // Call the onLogin function with form data
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Box
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    px: 4,
                    py: 6,
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Logo/>
                <Typography variant="h6">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
           
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: colors.blueAccent[500] }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default SignIn;
