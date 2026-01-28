"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { fetchUsersThunk } from "../redux/adminSlice";

const API_URL = "http://localhost:5000";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/auth/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(res.data);
  };

  const toggleBlock = async (id: number) => {
    await axios.patch(
      `${API_URL}/auth/admin/block/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchUsers();
  };

  useEffect(() => {
    fetchUsersThunk();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {users.map((user) => (
        <Card key={user.userid} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>
              <b>Name:</b> {user.username}
            </Typography>
            <Typography>
              <b>Email:</b> {user.useremail}
            </Typography>
            <Typography>
              <b>Role:</b> {user.role}
            </Typography>
            <Typography>
              <b>Status:</b>{" "}
              {user.isBlocked ? "Blocked ❌" : "Active ✅"}
            </Typography>

            <Button
              sx={{ mt: 1 }}
              color={user.isBlocked ? "success" : "error"}
              variant="contained"
              onClick={() => toggleBlock(user.userid)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
