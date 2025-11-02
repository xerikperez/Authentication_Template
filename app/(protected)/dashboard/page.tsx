import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ensureDefaultMealPlans } from "@/lib/meal-plans";
import {
  calculateDailyTotals,
  calculateStreak,
  getDayKey,
} from "@/lib/meal-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userPromise = db.user.findUnique({
    where: { id: session.user.id },
    include: { currentPlan: true },
  });
  const entriesPromise = db.foodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { loggedDate: "desc" },
  });

  const [user, entries, mealPlans] = await Promise.all([
    userPromise,
    entriesPromise,
    ensureDefaultMealPlans(),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

  const defaultPlan =
    mealPlans.find((plan) => plan.slug === "maintenance-2200") ?? mealPlans[0];

  const activePlan = user.currentPlan ?? defaultPlan ?? null;

  if (!user.currentPlanId && activePlan) {
    await db.user.update({
      where: { id: user.id },
      data: { currentPlanId: activePlan.id },
    });
  }

  const todayKey = getDayKey(new Date());
  const todayTotals = calculateDailyTotals(entries, todayKey);
  const streak = calculateStreak(entries);
  const recentMeals = entries.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Daily dashboard</h1>
        <p className="text-sm text-slate-400">
          Track calories, macros, and stay consistent with your logging streak.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/60 text-white">
          <CardHeader>
            <CardTitle>Today&apos;s nutrition</CardTitle>
            <CardDescription className="text-slate-400">
              Totals based on meals logged today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total calories
              </p>
              <p className="text-3xl font-semibold text-amber-300">
                {todayTotals.calories} kcal
              </p>
              {activePlan && (
                <p className="text-xs text-slate-400">
                  Goal: {activePlan.calories} kcal
                </p>
              )}
            </div>
            {activePlan ? (
              <div className="grid gap-4">
                <ProgressBar
                  label="Protein"
                  value={todayTotals.protein}
                  goal={activePlan.protein}
                  unit="g"
                />
                <ProgressBar
                  label="Carbs"
                  value={todayTotals.carbs}
                  goal={activePlan.carbs}
                  unit="g"
                />
                <ProgressBar
                  label="Fat"
                  value={todayTotals.fat}
                  goal={activePlan.fat}
                  unit="g"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Choose a meal plan to unlock macro targets.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-slate-800 bg-slate-900/60 text-white">
            <CardHeader>
              <CardTitle>Logging streak</CardTitle>
              <CardDescription className="text-slate-400">
                Log meals every day to keep the streak alive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-semibold text-amber-300">
                  {streak}
                </span>
                <span className="pb-2 text-sm text-slate-400">
                  day{streak === 1 ? "" : "s"} in a row
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Keep logging at least one meal every day. Streaks reset after a
                full day without entries.
              </p>
            </CardContent>
          </Card>

          {activePlan && (
            <Card className="border-slate-800 bg-slate-900/60 text-white">
              <CardHeader>
                <CardTitle>{activePlan.name} plan</CardTitle>
                {activePlan.description && (
                  <CardDescription className="text-slate-400">
                    {activePlan.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                <PlanMetric label="Calories" value={activePlan.calories} suffix="kcal" />
                <PlanMetric label="Protein" value={activePlan.protein} suffix="g" />
                <PlanMetric label="Carbs" value={activePlan.carbs} suffix="g" />
                <PlanMetric label="Fat" value={activePlan.fat} suffix="g" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle>Recent meals</CardTitle>
          <CardDescription className="text-slate-400">
            The last meals you logged, with calorie and macro totals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentMeals.length === 0 ? (
            <p className="text-sm text-slate-400">
              No meals logged yet. Add your first meal to get started.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentMeals.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{entry.name}</p>
                    <p className="text-xs text-slate-400">{entry.quantity}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                    <Metric label="Calories" value={`${entry.calories} kcal`} />
                    <Metric label="Protein" value={`${entry.protein} g`} />
                    <Metric label="Carbs" value={`${entry.carbs} g`} />
                    <Metric label="Fat" value={`${entry.fat} g`} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <span className="rounded-full bg-slate-800 px-3 py-1">
    <span className="font-medium text-white">{value}</span>
    <span className="ml-1 text-slate-400">{label}</span>
  </span>
);

const PlanMetric = ({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className={cn("text-lg font-semibold text-amber-300")}>
      {value} {suffix}
    </p>
  </div>
);
