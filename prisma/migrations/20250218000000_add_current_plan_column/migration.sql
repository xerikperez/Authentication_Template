-- Create the MealPlan table when missing so preset plans can be stored
CREATE TABLE IF NOT EXISTS "MealPlan" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "calories" INTEGER NOT NULL,
  "protein" INTEGER NOT NULL,
  "carbs" INTEGER NOT NULL,
  "fat" INTEGER NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MealPlan_slug_key" UNIQUE ("slug")
);

-- Create the FoodEntry table when missing for manual logging
CREATE TABLE IF NOT EXISTS "FoodEntry" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quantity" TEXT NOT NULL,
  "calories" INTEGER NOT NULL,
  "protein" DOUBLE PRECISION NOT NULL,
  "carbs" DOUBLE PRECISION NOT NULL,
  "fat" DOUBLE PRECISION NOT NULL,
  "loggedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add index for the FoodEntry daily history view when the table exists
CREATE INDEX IF NOT EXISTS "FoodEntry_userId_loggedDate_idx"
ON "FoodEntry" ("userId", "loggedDate");

-- Ensure the User table has the currentPlanId column for meal plan relations
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "currentPlanId" TEXT;

-- Attach foreign keys guarding relational integrity only when missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'FoodEntry_userId_fkey'
  ) THEN
    ALTER TABLE "FoodEntry"
    ADD CONSTRAINT "FoodEntry_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'User_currentPlanId_fkey'
  ) THEN
    ALTER TABLE "User"
    ADD CONSTRAINT "User_currentPlanId_fkey"
    FOREIGN KEY ("currentPlanId") REFERENCES "MealPlan"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;
