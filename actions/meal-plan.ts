"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const setActiveMealPlan = async (planId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to update your plan." };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { currentPlanId: planId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/meal-plans");

  return { success: "Meal plan updated." };
};
