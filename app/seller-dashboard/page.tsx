"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getMyProductsThunk,
} from "../redux/productsSlice";

export default function SellerDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { myProducts, loading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }

if (user.role !== "Seller") {
  router.push("/dashboard");
  return;
}


    dispatch(getMyProductsThunk());
  }, [dispatch, user, router]);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Seller Dashboard
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push("/addProduct")}
      >
        Add Product
      </Button>

      {myProducts.length === 0 && (
        <Typography>No products created yet</Typography>
      )}

      {myProducts.map((product) => (
        <Card key={product.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography>₹{product.price}</Typography>
            <Typography>Stock: {product.stock}</Typography>
            <Typography>Category: {product.category}</Typography>

            <Button
              sx={{ mt: 1 }}
              onClick={() =>
                router.push(`/seller/edit-product/${product.id}`)
              }
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
