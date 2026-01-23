"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Card,
  Box,
  CardContent,
  CardActions,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProductsThunk } from "../redux/productsSlice";


export default function Dashboard() {

  interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
}

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: products } = useAppSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 600);

  const [category, setCategory] = useState("");

  function useDebounce<Typing>(value: Typing, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}


  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        page: 1,
        limit: 20,
        category,
        name: search,
      })
    );
  }, [dispatch, category, debouncedSearch]); 

  return (
    <>

    <AppBar sx={{ backgroundColor: "#2874f0", boxShadow: "none" }}  component="div">
  <Toolbar sx={{ px: { xs: 2, md: 6 }, gap: 3,display:"flex",justifyContent:"space-between" }}>

    <Box
      sx={{ cursor: "pointer", lineHeight: 1 }}
      onClick={() => router.push("/dashboard")}
    >
      <Typography
        sx={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        Flipkart
      </Typography>
      <Typography
        sx={{
          color: "#ffe500",
          fontSize: 12,
          fontStyle: "italic",
        }}
      >
        Explore Plus +
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 1,
        px: 1,
        flexGrow: 1,
        maxWidth: 600,
      }}
    >
      <InputBase
        placeholder="Search for products, brands and more"
        sx={{ flex: 1, px: 1 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>

    <Select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      displayEmpty
      sx={{
        backgroundColor: "white",
        minWidth: 160,
        height: 36,
      }}
    >
      <MenuItem value="">All Categories</MenuItem>
      <MenuItem value="Electronics">Electronics</MenuItem>  
      <MenuItem value="Fashion">Fashion</MenuItem>
      <MenuItem value="Grocery">Grocery</MenuItem>
    </Select>
<div>

  <Button
      variant="contained"
      sx={{
        backgroundColor: "white",
        color: "#2874f0",
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": { backgroundColor: "#f1f1f1" },
      }}
    >
      Cart
    </Button>

    <Button
      color="inherit"
      sx={{ textTransform: "none" ,fontSize:"20px" , ml:3}}
      onClick={() => router.push("/authentication/login")}
    >
      Logout
    </Button>
</div>
    
  </Toolbar>
</AppBar>

<Box
  sx={{
    display: "flex",
    flexDirection:"row",
    gap: 3,
    padding: 3,
 marginTop:"80px"
  }}
>
  
  {products && products.map((product: Product) => (
    <Card key={product.id}>
      <CardContent>
        <div style={{textAlign:"center"}}>
        <img src={product.images[0]} alt="Product Image" style={{width:"200px" , height:"200px"}}/>
        </div>
        <Typography variant="h6">{product.name}</Typography>
        <Typography>₹{product.price}</Typography>
        <Typography variant="body2">
          {product.category}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={() =>
            router.push(`/dashboard/product/${product.id}`)
          }
        >
          Product Details
        </Button>
        <Button size="small" variant="contained">
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  ))}
</Box>
    </>
  );
}
