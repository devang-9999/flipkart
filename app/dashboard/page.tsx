"use client";
import SearchIcon from "@mui/icons-material/Search";
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
  IconButton
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProductsThunk} from "../redux/productsSlice";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import { carouselImages } from "./carousel";



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

  const [searchTerm, setSearchTerm] = useState("");

  const [Category, setCategory] = useState("");


useEffect(() => {
  const trimmedSearch = searchTerm.trim();

  if (trimmedSearch) {
    const handler = setTimeout(() => {
      dispatch(
        fetchProductsThunk({
          searchTerm: trimmedSearch,
          page: 1,
        })
      );
    }, 500);

    return () => clearTimeout(handler);
  }
 if (Category) {
    dispatch(
      fetchProductsThunk({
        category: Category,
        page: 1,
      })
    );
    return;
  }

  dispatch(fetchProductsThunk({ page: 1 }));
}, [dispatch, searchTerm, Category]);



  return (
    <>
<AppBar sx={{ backgroundColor: "#2874f0", boxShadow: "none" }} component="div">
  <Toolbar
    sx={{
      px: { xs: 2, md: 6 },
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
    component="div"
  >

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
        ml: 4,
        flexGrow: 1,
        maxWidth: 600,
        display: "flex",
        backgroundColor: "white",
        borderRadius: 1,
        px: 1,
        alignItems: "center",
      }}
    >
      <InputBase
        placeholder="Search for products, brands and more"
        sx={{ flex: 1, px: 1 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton>
        <SearchIcon sx={{ color: "#2874f0" }} />
      </IconButton>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", ml: 4, gap: 3 }}>
      <Select
        value={Category}
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

      <Button
        variant="contained"
        sx={{
          backgroundColor: "white",
          color: "#2874f0",
          fontWeight: "bold",
          textTransform: "none",
          px: 3,
          "&:hover": { backgroundColor: "#f1f1f1" },
        }}
        onClick={() => router.push("/cart")}
      >
        Cart
      </Button>

      <Button
        color="inherit"
        sx={{ textTransform: "none", fontSize: 16 }}
        onClick={() => router.push("/authentication/login")}
      >
        Logout
      </Button>
    </Box>
  </Toolbar>
</AppBar>


<Box sx={{ mt: "80px", px: 3 }}>
  <Carousel
    indicators={true}
    autoPlay
    interval={3000}
    animation="slide"
    navButtonsAlwaysVisible
  >
    {carouselImages.map((img, index) => (
      <Box
        key={index}
        sx={{
          position: "relative",
          height: "700px",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Image
          src={img}
          alt={`banner-${index}`}
          fill
          style={{ objectFit: "fill" }}
          priority={index === 0}
        />
      </Box>
    ))}
  </Carousel>
</Box>


<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 3,
    padding: 3,
 marginTop:"20px",
    marginX: "auto"
  }}
>
  
  {products && products.map((product: Product) => (
    <Card key={product.id} style={{width:"232px"}}>
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
            router.push(`/productDetail/${product.id}`)
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
