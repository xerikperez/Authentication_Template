import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddMealPage = () => {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Food logging
        </p>
        <h1 className="text-3xl font-semibold">Add a meal</h1>
        <p className="text-muted-foreground">
          Record what you ate to update your calorie and macro progress for the day.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Meal details</CardTitle>
          <CardDescription>
            Fill out the meal information below. You can add multiple items later from the
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="meal-name">Meal name</Label>
                <Input
                  id="meal-name"
                  name="name"
                  placeholder="e.g. Grilled chicken salad"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-quantity">Quantity</Label>
                <Input
                  id="meal-quantity"
                  name="quantity"
                  placeholder="1 bowl"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal-calories">Calories</Label>
                <Input
                  id="meal-calories"
                  name="calories"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="450"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Macros</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the macronutrients for this meal to keep your dashboard up to date.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="meal-protein">Protein (g)</Label>
                  <Input
                    id="meal-protein"
                    name="protein"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meal-carbs">Carbs (g)</Label>
                  <Input
                    id="meal-carbs"
                    name="carbs"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meal-fat">Fat (g)</Label>
                  <Input
                    id="meal-fat"
                    name="fat"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="12"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="min-w-[140px]">
                Save meal
              </Button>
              <Button asChild variant="ghost">
                <Link href="/(protected)/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddMealPage;
