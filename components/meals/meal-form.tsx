"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FoodEntrySchema } from "@/schemas";
import { createFoodEntry } from "@/actions/food-entry";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

const fieldConfig = [
  { name: "name", label: "Meal name", placeholder: "Chicken bowl" },
  { name: "quantity", label: "Quantity", placeholder: "1 serving" },
  { name: "calories", label: "Calories", placeholder: "550" },
  { name: "protein", label: "Protein (g)", placeholder: "45" },
  { name: "carbs", label: "Carbs (g)", placeholder: "60" },
  { name: "fat", label: "Fat (g)", placeholder: "18" },
] as const;

type FoodEntryFormValues = z.input<typeof FoodEntrySchema>;

export const MealForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<FoodEntryFormValues>({
    resolver: zodResolver(FoodEntrySchema),
    defaultValues: {
      name: "",
      quantity: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    },
  });

  const onSubmit = (values: FoodEntryFormValues) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const parsed = FoodEntrySchema.parse(values);
      const result = await createFoodEntry(parsed);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(result?.success ?? "Meal logged.");
      form.reset();
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Add meal</h2>
        <p className="text-sm text-slate-400">
          Log calories and macros for anything you ate today.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
        >
          {fieldConfig.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: controller }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder}
                      {...controller}
                      disabled={isPending}
                      inputMode={
                        field.name === "name" || field.name === "quantity"
                          ? "text"
                          : "decimal"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className="md:col-span-2 space-y-3">
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
              {isPending ? "Saving..." : "Log meal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
