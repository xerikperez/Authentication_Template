"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ensureDefaultMealPlans } from "@/lib/meal-plans";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "User already exists." };
  }

  const plans = await ensureDefaultMealPlans();
  const defaultPlan = plans.find((plan) => plan.slug === "maintenance-2200") ?? plans[0];

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      currentPlanId: defaultPlan?.id,
    },
  });

  return { success: "Account created. You can now log in." };
};
