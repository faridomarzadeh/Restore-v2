import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  return (
    <Container maxWidth="sm" sx={{ borderRadius: 3 }} component={Paper}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="8"
      >
        <LockOutlined sx={{ mt:3, color: "secondary.main", fontSize:40 }} />
        <Typography variant="h5">Sign In</Typography>
        <Box 
        component='form'
        display='flex'
        flexDirection='column'
        width='100%'
        gap={3}
        marginY={3}
          >
            <TextField fullWidth label='Email' autoFocus/>
            <TextField fullWidth label='Password' type="password"/>
            <Button variant="contained">Sign In</Button>
            <Typography sx={{textAlign:'center'}}>
                Don't have an account?
                <Typography sx={{ml:1, textDecoration:'none'}} color="primary" component={Link} to={'/register'}>Sign Up</Typography>
            </Typography>
        </Box>
      </Box>
    </Container>
  );
};
