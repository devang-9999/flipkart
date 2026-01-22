"use client";

import Image from "next/image";
import flipkart from "../../../public/Flipkart.png";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import "./register.css";
import NavLogo from "../../../public/Screenshot from 2026-01-21 14-41-06.png";

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
import { registerUserThunk, resetAuthState } from "../../redux/authSlice";

const RegisterUserSchema = z
  .object({
    username: z.string().min(4, "Username should be of minimum 4 characters"),
    useremail: z.string().email("Invalid email"),
    role: z.string().min(1, "Role is required"),
    userpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => !val.includes(" "), {
        message: "Password must not contain spaces",
      }),
    // cpassword: z.string().min(8, "Confirm Password is required"),
  })
  // .refine((data) => data.userpassword === data.cpassword, {
  //   path: ["cpassword"],
  //   message: "Passwords do not match",
  // });

type RegisterFormData = z.infer<typeof RegisterUserSchema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      role: "",
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    const { username, useremail, userpassword, role } = data;
console.log(data)
    dispatch(
      registerUserThunk({
        username,
        useremail,
        userpassword,
        role,
      })
    );
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      const username = result.user.displayName || "google_user";

      if (!email) {
        setSnackbarOpen(true);
        return;
      }

      dispatch(
        registerUserThunk({
          username,
          useremail: email,
          userpassword: "12345678",
          role: "User",
        })
      );
    } catch {
      setSnackbarOpen(true);
    }
  };
  

  useEffect(() => {
    if (success || error) {
      setSnackbarOpen(true);
    }

    if (success) {
      reset();
      setTimeout(() => router.push("/authentication/login"), 500);
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [success, error, dispatch, reset, router]);

  return (
    <>
      <Image src={NavLogo} width={2200} alt="Navbar" />

      <div className="Container">
        <div className="Sidebar">
          <h1>Looks like you are new here!</h1>
          <h2>Sign up with your mobile number to get started</h2>

          <Image
            src={flipkart}
            alt="Flipkart"
            width={220}
            height={180}
            style={{ marginLeft: "40px" }}
          />
        </div>

        <div className="Design">
          <form onSubmit={handleSubmit(handleRegister)}>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Name"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Email Address"
              {...register("useremail")}
              error={!!errors.useremail}
              helperText={errors.useremail?.message}
            />

            <FormControl fullWidth error={!!errors.userpassword}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                sx={{ mb: 2 }}
                type={showPassword ? "text" : "password"}
                {...register("userpassword")}
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
              <FormHelperText>{errors.userpassword?.message}</FormHelperText>
            </FormControl>



            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ""}
                  displayEmpty
                  sx={{ width: "400px" }}
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Seller">Seller</MenuItem>
                </Select>
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: "rgba(40, 116, 240)",
                fontWeight: "bold",
              }}
            >
              Existing User ?{" "}
              <Link
                href="/authentication/login"
                style={{
                  textDecoration: "none",
                  color: "rgba(40, 116, 240)",
                }}
              >
                Login
              </Link>
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleSignup}
            >
              Sign up with Google
            </Button>
          </form>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={message || error || "Google sign up failed"}
        />
      </div>
    </>
  );
}
