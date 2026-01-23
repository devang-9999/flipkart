"use client";

import { Box, Button, Typography, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/navigation";

export default function FlipkartHeader() {
  const router = useRouter();

  return (
    <>
 
      <Box
        sx={{
          backgroundColor: "#2874f0",
          height: 64,
          display: "flex",
          flexDirection:"row",justifyContent:"space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
        }}

         >
        <Box sx={{ cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
          <Typography
            sx={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              fontStyle: "italic",
              lineHeight: 1,
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
          }}
        >
          <InputBase
            placeholder="Search for products, brands and more"
            sx={{ flex: 1, px: 1 }}
          />
          <IconButton>
            <SearchIcon sx={{ color: "#2874f0" }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 4, gap: 3 }}>
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
            onClick={() => router.push("/authentication/login")}
          >
            Login
          </Button>

          <Typography sx={{ color: "white", fontWeight: 500, cursor: "pointer" }}>
            Become a Seller
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Typography sx={{ color: "white", fontWeight: 500 }}>
              More
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: "white" }} />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => router.push("/cart")}
          >
            <ShoppingCartIcon sx={{ color: "white", mr: 0.5 }} />
            <Typography sx={{ color: "white", fontWeight: 500 }}>
              Cart
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: 40,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          px: 4,
          backgroundColor: "white",
        }}
      >
        {[
          "Electronics",
          "TVs & Appliances",
          "Men",
          "Women",
          "Baby & Kids",
          "Home & Furniture",
          "Sports, Books & More",
          "Flights",
          "Offer Zone",
        ].map((item) => (
          <Box
            key={item}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: 500,
              "&:hover": { color: "#2874f0" },
            }}
          >
            <Typography sx={{ fontSize: 14 }}>{item}</Typography>
            {item !== "Flights" && item !== "Offer Zone" && (
              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            )}
          </Box>
        ))}
      </Box>
 
    </>
  );
}
