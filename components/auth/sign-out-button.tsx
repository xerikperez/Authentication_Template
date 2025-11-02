"use client";

import { useTransition } from "react";
import { signOutUser } from "@/actions/sign-out";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      onClick={() => startTransition(() => signOutUser())}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
};
