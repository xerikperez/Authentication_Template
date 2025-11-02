import { db } from "@/lib/db";
import { MealPlan } from "@prisma/client";

export const DEFAULT_MEAL_PLANS: Array<
  Pick<MealPlan, "name" | "slug" | "calories" | "protein" | "carbs" | "fat"> & {
    description?: string;
  }
> = [
  {
    name: "Weight Loss",
    slug: "weight-loss-1800",
    calories: 1800,
    protein: 150,
    carbs: 160,
    fat: 55,
    description: "Light calorie deficit with higher protein to support satiety.",
  },
  {
    name: "Maintenance",
    slug: "maintenance-2200",
    calories: 2200,
    protein: 160,
    carbs: 240,
    fat: 70,
    description: "Balanced maintenance calories with even macro split.",
  },
  {
    name: "Muscle Gain",
    slug: "muscle-2600",
    calories: 2600,
    protein: 190,
    carbs: 300,
    fat: 80,
    description: "Moderate surplus for lean muscle gain and recovery.",
  },
];

export async function ensureDefaultMealPlans() {
  const plans = await Promise.all(
    DEFAULT_MEAL_PLANS.map((plan) =>
      db.mealPlan.upsert({
        where: { slug: plan.slug },
        create: { ...plan },
        update: { ...plan },
      })
    )
  );

  const order = new Map(DEFAULT_MEAL_PLANS.map((plan, index) => [plan.slug, index]));

  return plans.sort((a, b) => {
    const aIndex = order.get(a.slug) ?? 0;
    const bIndex = order.get(b.slug) ?? 0;

    return aIndex - bIndex;
  });
}

export type MealPlanMeal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealPlanVariation = {
  meals: MealPlanMeal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

function getRandomRatios(count: number) {
  const values = Array.from({ length: count }, () => Math.random());
  const sum = values.reduce((total, value) => total + value, 0);

  return values.map((value) => value / sum);
}

export function generateMealPlanVariation(plan: MealPlan): MealPlanVariation {
  const mealNames = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const ratios = getRandomRatios(mealNames.length);

  const meals = mealNames.map((name, index) => {
    const ratio = ratios[index];

    return {
      name,
      calories: Math.round(plan.calories * ratio / 10) * 10,
      protein: Math.round(plan.protein * ratio),
      carbs: Math.round(plan.carbs * ratio),
      fat: Math.round(plan.fat * ratio),
    };
  });

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { meals, totals };
}

export function buildMealPlanCsv(plan: MealPlan, variation?: MealPlanVariation) {
  const lines: string[] = [];
  lines.push(`Meal Plan,${plan.name}`);
  lines.push("Section,Calories,Protein (g),Carbs (g),Fat (g)");

  if (variation) {
    variation.meals.forEach((meal) => {
      lines.push(
        `${meal.name},${meal.calories},${meal.protein},${meal.carbs},${meal.fat}`
      );
    });
    lines.push(
      `Total,${variation.totals.calories},${variation.totals.protein},${variation.totals.carbs},${variation.totals.fat}`
    );
  } else {
    lines.push(
      `Target Totals,${plan.calories},${plan.protein},${plan.carbs},${plan.fat}`
    );
  }

  return lines.join("\n");
}
