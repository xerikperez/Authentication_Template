"use client";

import { useMemo, useState, useTransition } from "react";
import { MealPlan } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { setActiveMealPlan } from "@/actions/meal-plan";
import {
  MealPlanVariation,
  buildMealPlanCsv,
  generateMealPlanVariation,
} from "@/lib/meal-plans";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useRouter } from "next/navigation";

interface MealPlansClientProps {
  plans: MealPlan[];
  activePlanId?: string | null;
}

export const MealPlansClient = ({ plans, activePlanId }: MealPlansClientProps) => {
  const [variations, setVariations] = useState<Record<string, MealPlanVariation>>({});
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sortedPlans = useMemo(
    () => plans.slice().sort((a, b) => a.calories - b.calories),
    [plans]
  );

  const handleDownload = (plan: MealPlan) => {
    const variation = variations[plan.id];
    const csv = buildMealPlanCsv(plan, variation);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${plan.slug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateVariation = (plan: MealPlan) => {
    const variation = generateMealPlanVariation(plan);
    setVariations((current) => ({ ...current, [plan.id]: variation }));
  };

  const handleSetActive = (planId: string) => {
    setMessage(undefined);
    setError(undefined);

    startTransition(async () => {
      const result = await setActiveMealPlan(planId);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setMessage(result?.success ?? "Meal plan updated.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FormSuccess message={message} />
        <FormError message={error} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {sortedPlans.map((plan) => {
          const isActive = plan.id === activePlanId;
          const variation = variations[plan.id];

          return (
            <div
              key={plan.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 text-white shadow"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {isActive && (
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200">
                      Active
                    </span>
                  )}
                </div>
                {plan.description && (
                  <p className="text-sm text-slate-400">{plan.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                <Macro label="Calories" value={`${plan.calories} kcal`} />
                <Macro label="Protein" value={`${plan.protein} g`} />
                <Macro label="Carbs" value={`${plan.carbs} g`} />
                <Macro label="Fat" value={`${plan.fat} g`} />
              </div>
              <div className="flex flex-wrap gap-2">
                {!isActive && (
                  <Button
                    onClick={() => handleSetActive(plan.id)}
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Set as active"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDownload(plan)}
                  disabled={isPending}
                >
                  Download CSV
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleGenerateVariation(plan)}
                  disabled={isPending}
                >
                  Generate variation
                </Button>
              </div>
              {variation && (
                <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Suggested meals
                  </p>
                  <ul className="space-y-1">
                    {variation.meals.map((meal) => (
                      <li key={meal.name} className="flex justify-between gap-2">
                        <span className="font-medium text-white">{meal.name}</span>
                        <span className="text-xs text-slate-400">
                          {meal.calories} kcal · {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Macro = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-sm font-medium text-amber-200">{value}</p>
  </div>
);
