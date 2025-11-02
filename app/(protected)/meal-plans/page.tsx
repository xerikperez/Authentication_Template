import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ensureDefaultMealPlans } from "@/lib/meal-plans";
import { db } from "@/lib/db";
import { MealPlansClient } from "@/components/meal-plans/meal-plans-client";

export default async function MealPlansPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [plans, user] = await Promise.all([
    ensureDefaultMealPlans(),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { currentPlanId: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Meal plans</h1>
        <p className="text-sm text-slate-400">
          Choose one of the preset plans or export macros for offline planning.
        </p>
      </div>

      <MealPlansClient plans={plans} activePlanId={user?.currentPlanId} />
    </div>
  );
}
