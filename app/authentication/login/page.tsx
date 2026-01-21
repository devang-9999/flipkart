"use client";
import Image from 'next/image';
import flipkart from '../../../public/Flipkart.png';
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Snackbar from '@mui/material/Snackbar';
import "./login.css";
import NavLogo from "../../../public/Screenshot from 2026-01-21 14-41-06.png"
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

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "../../firebase/firebase";


const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password should be of 8 characters")
})

type LoginFormData = z.infer<typeof LoginSchema>

export default function Login() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>(
    {
      resolver: zodResolver(LoginSchema),
      mode: "onChange",
    })
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const showSnackbar = (
    message: string,
  ) => {
    setSnackbar({
      open: true,
      message,
    });
  };


  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (data: LoginFormData) => {

    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      // alert("User Logged in successfully");
      showSnackbar("User Logged In Successfully")
      setTimeout(() => router.push("/"), 500)

    }
    catch (error) {
      // alert("Invalid username or password")
      showSnackbar("Invalid Username Or Password")
      // setTimeout(() => router.push("/register"),500)

    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // alert("User Logged in successfully");
      showSnackbar("User Logged In Successfully")
      setTimeout(() => router.push("/dashboard"), 500)

    }
    catch (error) {
      // alert("Google sign in failed")
      showSnackbar("User Logged In Successfully")
      // setTimeout(() => router.push("/register"),500)
    }
  };

  return (
      <>
            <Image  src={NavLogo} width={2100} alt='Navbar'/>
    <div className="Container">
      <div className="Sidebar">
        <h1>Login</h1>
        <h2>Get access to your Orders, Wishlist and Recommendations</h2>
        {/* <span>Get access to your Orders, Wishlist and Recommendations</span> */}
        <Image
          src={flipkart}
          alt="Flipkart"
          width={220}
          height={180}
          style={{ marginLeft: "69px" }}
        />
      </div>
      <div className="DesignLogin">



        <form onSubmit={handleSubmit(handleLogin)} >


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
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>

          <Typography align="center" sx={{ mt: 2 , color:"rgba(40, 116, 240)",fontWeight:"bold"}} >
            New to Flipkart?  <Link style={{textDecoration:"none" , color:"rgba(40, 116, 240)" , fontWeight:"bold"}} href="http://localhost:3000/authentication/register">Create an account</Link>
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
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />

    </div>
    </>
  );
}
