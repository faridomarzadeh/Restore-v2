import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi";
import {
  registerSchema,
  RegisterSchema,
} from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap();
    } catch (error) {
        handleRegisteError(error);
    }
  };

  const handleRegisteError = (error: unknown) => {
    const apiError = error as { message: string };
    if (apiError.message && typeof apiError.message == "string") {
      const errorsArray = apiError.message.split(";");
      errorsArray.forEach((err) => {
        if (err.includes("Password")) {
          setError("password", { message: err });
        } else if (err.includes("Email")) {
          setError("email", { message: err });
        }
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ borderRadius: 3 }} component={Paper}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="8"
      >
        <LockOutlined sx={{ mt: 3, color: "secondary.main", fontSize: 40 }} />
        <Typography variant="h5">Register</Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          width="100%"
          gap={3}
          marginY={3}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            fullWidth
            label="Email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isValid}
          >
            Register
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?
            <Typography
              sx={{ ml: 1, textDecoration: "none" }}
              color="primary"
              component={Link}
              to={"/login"}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
