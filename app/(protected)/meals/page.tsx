import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MealForm } from "@/components/meals/meal-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateTotals,
  getDisplayDate,
  groupEntriesByDay,
} from "@/lib/meal-utils";

export default async function MealsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const entries = await db.foodEntry.findMany({
    where: { userId: session.user.id },
    orderBy: [{ loggedDate: "desc" }, { createdAt: "desc" }],
  });

  const groupedEntries = groupEntriesByDay(entries);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Meals</h1>
        <p className="text-sm text-slate-400">
          Log meals manually and review everything you&apos;ve eaten each day.
        </p>
      </div>

      <MealForm />

      <Card className="border-slate-800 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle>Meal history</CardTitle>
          <CardDescription className="text-slate-400">
            Meals are grouped by the day you logged them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedEntries.length === 0 ? (
            <p className="text-sm text-slate-400">
              You haven&apos;t logged any meals yet. Add one using the form above.
            </p>
          ) : (
            <ul className="space-y-6">
              {groupedEntries.map((group) => {
                const totals = calculateTotals(group.entries);

                return (
                  <li
                    key={group.key}
                    className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {getDisplayDate(group.date)}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {group.entries.length} meal{group.entries.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <DayTotal label="Calories" value={`${totals.calories} kcal`} />
                        <DayTotal label="Protein" value={`${totals.protein} g`} />
                        <DayTotal label="Carbs" value={`${totals.carbs} g`} />
                        <DayTotal label="Fat" value={`${totals.fat} g`} />
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-200">
                      {group.entries.map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-lg border border-slate-800 bg-slate-900/70 p-3"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-medium text-white">{entry.name}</p>
                              <p className="text-xs text-slate-400">{entry.quantity}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                              <span>{entry.calories} kcal</span>
                              <span>{entry.protein} g protein</span>
                              <span>{entry.carbs} g carbs</span>
                              <span>{entry.fat} g fat</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const DayTotal = ({ label, value }: { label: string; value: string }) => (
  <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">
    <span className="font-medium text-white">{value}</span>
    <span className="ml-1 text-slate-400">{label}</span>
  </span>
);
