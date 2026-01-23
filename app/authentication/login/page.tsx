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
// import NavLogo from "../../../public/Screenshot from 2026-01-21 14-41-06.png";

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

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  loginUserThunk,
} from "../../redux/authSlice";
import FlipkartHeader from "@/app/components/FlipkartHeader";

const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password should be of 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;

      if (!email) {
        setSnackbarOpen(true);
        return;
      }

      dispatch(
  loginUserThunk({
    email,
    password: "12345678",
  })
);

    } catch {
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (success || error) {
      // setSnackbarOpen(true);
    }

    if (success) {
      reset();
      setTimeout(() => router.push("/"), 500);
    }

  }, [success, error, dispatch, reset, router]);

  return (
    <>
      {/* <Image src={NavLogo} width={2200} alt="Navbar" /> */}
    <FlipkartHeader/>
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

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </form>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={message || error || "Google login failed"}
        />
      </div>
    </>
  );
}
