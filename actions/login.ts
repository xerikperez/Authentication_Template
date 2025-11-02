"use server";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const parsed = LoginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    });

    return { success: "Logged in successfully." };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    throw error;
  }
};
