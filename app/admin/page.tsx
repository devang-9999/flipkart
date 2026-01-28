"use client";

import { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchUsersThunk,
  toggleBlockUserThunk,
} from "../redux/adminSlice";

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { users, loading } = useAppSelector(
    (state) => state.admin
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/dashboard");
      return;
    }

    dispatch(fetchUsersThunk()); 
  }, [dispatch, user, router]);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {users.map((u) => (
        <Card key={u.userid} sx={{ mb: 2 }}>
          <CardContent>
            <Typography><b>Name:</b> {u.username}</Typography>
            <Typography><b>Email:</b> {u.useremail}</Typography>
            <Typography><b>Role:</b> {u.role}</Typography>
            <Typography>
              <b>Status:</b> {u.isBlocked ? "Blocked ❌" : "Active ✅"}
            </Typography>

            <Button
              sx={{ mt: 1 }}
              variant="contained"
              color={u.isBlocked ? "success" : "error"}
              onClick={() =>
                dispatch(toggleBlockUserThunk(u.userid))
              }
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
