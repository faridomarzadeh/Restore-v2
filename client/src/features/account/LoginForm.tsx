import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";

export const LoginForm = () => {


  const [login, {isLoading}] = useLoginMutation();

  const [userInfo] = useLazyUserInfoQuery();

  const location = useLocation();

  const { register, handleSubmit, formState: {errors} } = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema)
  });

  const navigate = useNavigate();
  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);
    if(!result.error)
      {
        await userInfo();
        navigate(location.state?.from ||'/catalog');
      }
  }
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
        onSubmit={handleSubmit(onSubmit)}
          >
            <TextField 
            fullWidth 
            label='Email' 
            autoFocus
            {...register('email')}
            error ={!!errors.email}
            helperText={errors.email?.message}
            />
            <TextField
            fullWidth
            label='Password' 
            type="password"
            {...register('password')}
            error ={!!errors.password}
            helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" disabled={isLoading}>Sign In</Button>
            <Typography sx={{textAlign:'center'}}>
                Don't have an account?
                <Typography sx={{ml:1, textDecoration:'none'}} color="primary" component={Link} to={'/register'}>Sign Up</Typography>
            </Typography>
        </Box>
      </Box>
    </Container>
  );
};

