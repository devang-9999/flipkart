"use client";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCartState } from "../redux/cartSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { carouselImages } from "./carousel";

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
import { fetchProductsThunk } from "../redux/productsSlice";
import { addToCartThunk } from "../redux/cartSlice";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { logout } from "../redux/authSlice";
import { getMyCartThunk } from "../redux/cartSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
}



export default function Dashboard() {


  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: products } = useAppSelector(
    (state) => state.products
  );

  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );


  const [searchTerm, setSearchTerm] = useState("");

  const [Category, setCategory] = useState("");

  const handleAddToCart = (productId: number) => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }

    dispatch(
      addToCartThunk({
        productId,
        quantity: 1,
      })
    );
  };
  useEffect(() => {
    if (user) {
      dispatch(getMyCartThunk());
    }
  }, [dispatch, user]);


  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      const handler = setTimeout(() => {
        dispatch(
          fetchProductsThunk({
            searchTerm: trimmedSearch,
            page: 1,
            limit: 20,
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
          limit: 20,
        })
      );
      return;
    }

    dispatch(fetchProductsThunk({ page: 1, limit: 20 }));
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
              <Badge
                badgeContent={cartCount}
                color="error"
                invisible={cartCount === 0}
              >
                <ShoppingCartIcon sx={{ mr: 1 }} />
              </Badge>
              Cart
            </Button>


            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {user ? `Hello, ${user.username}` : "Guest"}
            </Typography>

            {user ? (
              <Button
                color="inherit"
                sx={{ textTransform: "none", fontWeight: "bold" }}
                onClick={() => {
                  dispatch(logout());
                  dispatch(clearCartState());
                  router.push("/authentication/login");
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                color="inherit"
                sx={{ textTransform: "none", fontWeight: "bold" }}
                onClick={() => router.push("/authentication/login")}
              >
                Login
              </Button>
            )}




          </Box>
        </Toolbar>
      </AppBar>


      <Box sx={{ mt: "80px", px: 3 }}>
        <Carousel autoPlay={true}
          interval={4000}
          infiniteLoop={true}
          showArrows={true}
          showIndicators={true}
          stopOnHover={true}
          showThumbs={false}
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
          marginTop: "20px",
          marginX: "auto"
        }}
      >

        {products && products.map((product: Product) => (
          <Card key={product.id} style={{ width: "232px" }}>
            <CardContent>
              <div style={{ textAlign: "center" }}>
                <img src={product.images[0]} alt="Product Image" style={{ width: "200px", height: "200px" }} />
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
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </Button>

            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
}
