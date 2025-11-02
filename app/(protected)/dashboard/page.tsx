import Link from "next/link";

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dailySummary = {
  calories: {
    consumed: 1420,
    goal: 2000,
  },
  macros: [
    {
      label: "Protein",
      consumed: 120,
      goal: 150,
      unit: "g",
    },
    {
      label: "Carbs",
      consumed: 210,
      goal: 260,
      unit: "g",
    },
    {
      label: "Fat",
      consumed: 55,
      goal: 70,
      unit: "g",
    },
  ],
};

const mealPlans = [
  {
    name: "Weight Loss",
    calories: 1800,
    description: "High protein, nutrient-dense meals to support a modest calorie deficit.",
  },
  {
    name: "Maintenance",
    calories: 2200,
    description: "Balanced plan for sustaining energy and supporting everyday activity.",
  },
  {
    name: "Muscle Gain",
    calories: 2600,
    description: "Protein-forward meals paired with smart carbs for training days.",
  },
];

const streakDays = 5;

const DashboardPage = async () => {
  const session = await auth();
  const userName = session?.user?.name ?? "there";
  const caloriePercent = Math.min(
    100,
    Math.round((dailySummary.calories.consumed / dailySummary.calories.goal) * 100)
  );

  return (
    <section className="flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Daily dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Keep your streak alive by logging meals and staying on top of your goals.
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/(protected)/food/add">Log a meal</Link>
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Daily intake</CardTitle>
              <CardDescription>
                Track how today&apos;s nutrition stacks up against your goals.
              </CardDescription>
            </div>
            <div
              className="relative size-28 shrink-0 rounded-full bg-muted"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${caloriePercent}%, hsl(var(--muted)) 0)`,
              }}
              role="img"
              aria-label={`${caloriePercent}% of daily calorie goal consumed`}
            >
              <div className="absolute inset-3 rounded-full bg-background" />
              <div className="absolute inset-6 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-medium text-muted-foreground">Calories</span>
                <span className="text-lg font-semibold">
                  {dailySummary.calories.consumed}
                </span>
                <span className="text-xs text-muted-foreground">of {dailySummary.calories.goal}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Remaining calories</p>
                <p className="text-2xl font-semibold">
                  {Math.max(dailySummary.calories.goal - dailySummary.calories.consumed, 0)}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Goal completion</p>
                <p className="text-2xl font-semibold">{caloriePercent}%</p>
              </div>
            </div>
            <div className="space-y-4">
              {dailySummary.macros.map((macro) => {
                const progress = Math.min(100, Math.round((macro.consumed / macro.goal) * 100));

                return (
                  <div key={macro.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{macro.label}</span>
                      <span>
                        {macro.consumed}
                        {macro.unit} / {macro.goal}
                        {macro.unit}
                      </span>
                    </div>
                    <div
                      className="relative h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Streak</CardTitle>
            <CardDescription>
              Consistency builds momentum. Keep logging meals each day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-semibold">{streakDays}</span>
              <span className="pb-2 text-sm text-muted-foreground">
                day{streakDays === 1 ? "" : "s"} in a row
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tip: plan tomorrow&apos;s meals in advance to stay ahead of your streak.
            </p>
            <Button variant="outline" asChild>
              <Link href="/(protected)/food/add">Log today&apos;s meals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Meal plans</h2>
            <p className="text-muted-foreground">
              Choose a preset plan to guide your shopping and prep.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {mealPlans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.calories} kcal per day</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6 text-sm text-muted-foreground">
                <p>{plan.description}</p>
                <Button variant="secondary">View plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
};

export default DashboardPage;
