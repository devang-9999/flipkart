"use client";

import Image from "next/image";
import flipkart from "../../../public/Flipkart.png";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import "./login.css";

import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginUserThunk, resetAuthState } from "../../redux/authSlice";
import FlipkartHeader from "@/app/components/FlipkartHeader";

const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();

const { loading, success, error, message, user } = useAppSelector(
  (state) => state.auth
);


  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const handleLogin = (data: LoginFormData) => {
    dispatch(loginUserThunk(data));
  };

  useEffect(() => {
  if (success && user) {
    reset();

    setTimeout(() => {
      if (user.role === "Admin") {
        router.push("/admin");
      } else if (user.role === "Seller") {
        router.push("/seller-dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 300);
  }
}, [success, user, reset, router]);


  return (
    <>
      <FlipkartHeader />

      <div className="Container">
        <div className="Sidebar">
          <h1>Login</h1>
          <h2>Get access to your Orders, Wishlist and Recommendations</h2>

          <Image
            src={flipkart}
            alt="Flipkart"
            width={220}
            height={180}
            style={{ marginLeft: "69px" }}
          />
        </div>

        <div className="DesignLogin">
          <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <FormControl fullWidth error={!!errors.password}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                sx={{ mb: 2 }}
                type={showPassword ? "text" : "password"}
                {...register("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>{errors.password?.message}</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: "rgba(40, 116, 240)",
                fontWeight: "bold",
              }}
            >
              New to Flipkart?{" "}
              <Link
                href="/authentication/register"
                style={{
                  textDecoration: "none",
                  color: "rgba(40, 116, 240)",
                }}
              >
                Create an account
              </Link>
            </Typography>
          </form>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={message || error}
        />
      </div>
    </>
  );
}
