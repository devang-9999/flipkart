'use client';

import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByIdThunk } from '@/app/redux/productsSlice';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetail, loading } = useSelector(
    (state: any) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [dispatch, id]);

  if (loading || !productDetail) return <div>Loading...</div>;

  return (
    <div>
<Card
  sx={{
    maxWidth: 900,
    mx: "auto",
    mt: 30,
    p: 3,
    display: "flex",
    gap: 4,
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
  }}
>
  <Box
    sx={{
      minWidth: 300,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #eee",
      borderRadius: 2,
      p: 2,
    }}
  >
    <img
      src={productDetail.images?.[0] || "/placeholder.png"}
      alt={productDetail.name}
      width={280}
      height={280}
      style={{ objectFit: "contain" }}
    />
  </Box>

  <CardContent sx={{ flex: 1 }}>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {productDetail.name}
    </Typography>

    <Typography variant="body2" color="text.secondary" gutterBottom>
      Brand: <b>{productDetail.brand}</b>
    </Typography>

    <Typography variant="h6" sx={{ color: "#388e3c", mt: 1 }}>
      ₹{productDetail.price}
    </Typography>

    <Typography variant="body2" sx={{ mt: 1 }}>
      Category: <b>{productDetail.category}</b>
    </Typography>

    <Typography
      variant="body2"
      sx={{ mt: 1, color: productDetail.stock > 0 ? "green" : "red" }}
    >
      {productDetail.stock > 0
        ? `In Stock (${productDetail.stock} available)`
        : "Out of Stock"}
    </Typography>

    <Typography variant="body1" sx={{ mt: 2 }}>
      {productDetail.description}
    </Typography>

    <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ff9f00",
          color: "white",
          fontWeight: "bold",
          px: 4,
          "&:hover": { backgroundColor: "#fb8c00" },
        }}
      >
        Add to Cart
      </Button>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#fb641b",
          color: "white",
          fontWeight: "bold",
          px: 4,
          "&:hover": { backgroundColor: "#f4511e" },
        }}
      >
        Buy Now
      </Button>
    </Box>
  </CardContent>
</Card>
    </div>
  );
}
