import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const FoodEntrySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  calories: z.coerce.number().min(0, { message: "Calories must be 0 or more" }),
  protein: z.coerce.number().min(0, { message: "Protein must be 0 or more" }),
  carbs: z.coerce.number().min(0, { message: "Carbs must be 0 or more" }),
  fat: z.coerce.number().min(0, { message: "Fat must be 0 or more" }),
});
