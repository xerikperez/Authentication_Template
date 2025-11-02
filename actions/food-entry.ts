"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FoodEntrySchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const createFoodEntry = async (values: z.infer<typeof FoodEntrySchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to log meals." };
  }

  const parsed = FoodEntrySchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Please check the meal details." };
  }

  const { name, quantity, calories, protein, carbs, fat } = parsed.data;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await db.foodEntry.create({
    data: {
      name,
      quantity,
      calories: Math.round(calories),
      protein,
      carbs,
      fat,
      loggedDate: today,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/meals");

  return { success: "Meal saved." };
};
