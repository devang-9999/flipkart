"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import FlipkartHeader from "@/app/components/FlipkartHeader";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addProductThunk } from "../redux/productsSlice";

import "./addProduct.css";


const AddProductSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  images: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map((img) => img.trim()) : []
    ),
});

type ProductFormData = z.infer<typeof AddProductSchema>;


export default function AddProducts() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }

    if (user.role !== "Seller") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      images: [],
    },
  });

  const handleAddProducts = (data: ProductFormData) => {
    dispatch(addProductThunk(data));
    reset();
    router.push("/seller-dashboard"); 
  };

  if (!user || user.role !== "Seller") {
    return (
      <>
        <FlipkartHeader />
        <Typography sx={{ p: 4 }}>
          Redirecting...
        </Typography>
      </>
    );
  }

  return (
    <>
      <FlipkartHeader />

      <div className="Design">
        <form onSubmit={handleSubmit(handleAddProducts)}>
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Description"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            type="number"
            label="Price"
            {...register("price", { valueAsNumber: true })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Category"
            {...register("category")}
            error={!!errors.category}
            helperText={errors.category?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Brand"
            {...register("brand")}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            type="number"
            label="Stock"
            {...register("stock", { valueAsNumber: true })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Image URLs"
            placeholder="Comma separated URLs"
            {...register("images")}
            error={!!errors.images}
            helperText={errors.images?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            ADD 📦
          </Button>
        </form>
      </div>
    </>
  );
}
