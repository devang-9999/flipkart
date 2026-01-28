"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getMyCartThunk,
  addToCartThunk,
  removeItemThunk,
  // clearCartState,
} from "../redux/cartSlice";
import { getMyOrdersThunk, placeOrderThunk } from "../redux/orderSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "ONLINE">("COD");

  useEffect(() => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }
    dispatch(getMyCartThunk());
  }, [dispatch, user, router]);

  const increment = (productId: number) => {
    dispatch(addToCartThunk({ productId, quantity: 1 }));
  };

  const decrement = (productId: number, quantity: number) => {
    if (quantity === 1) {
      dispatch(removeItemThunk(productId));
    } else {
      dispatch(addToCartThunk({ productId, quantity: -1 }));
    }
  };

  const removeItem = (productId: number) => {
    dispatch(removeItemThunk(productId));
  };

  const totalCartPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const confirmOrder = async () => {
    if (!address || !phoneNumber) return;
await dispatch(placeOrderThunk({
  address,
  phoneNumber,
  paymentMethod,
}));

await dispatch(getMyOrdersThunk()); 
await dispatch(getMyCartThunk());

router.push("/orders");


router.push("/orders");

  };

  if (items.length === 0) {
    return <Typography sx={{ p: 4 }}>Cart is empty</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Cart
      </Typography>

      {items.map((item) => (
        <Card key={item.product.id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", gap: 2 }}>
            <img
              src={item.product.images[0]}
              width={120}
              height={120}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {item.product.name}
              </Typography>

              <Typography>
                Price: ₹{item.product.price}
              </Typography>

              <Typography>
                Total: ₹{item.product.price * item.quantity}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    decrement(item.product.id, item.quantity)
                  }
                >
                  -
                </Button>

                <Typography sx={{ mt: 1 }}>
                  {item.quantity}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => increment(item.product.id)}
                >
                  +
                </Button>

                <Button
                  color="error"
                  onClick={() => removeItem(item.product.id)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Cart Total: ₹{totalCartPrice}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => setOpen(true)}
        >
          Place Order
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Order</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Delivery Address"
            sx={{ mt: 2 }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
            fullWidth
            label="Phone Number"
            sx={{ mt: 2 }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Select
            fullWidth
            sx={{ mt: 2 }}
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as "COD" | "ONLINE")
            }
          >
            <MenuItem value="COD">Cash on Delivery</MenuItem>
            <MenuItem value="ONLINE">Online Payment</MenuItem>
          </Select>

          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Total Amount: ₹{totalCartPrice}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmOrder}>
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
