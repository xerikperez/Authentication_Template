import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NavLink } from "@/components/layout/nav-link";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meals", label: "Meals" },
  { href: "/meal-plans", label: "Meal plans" },
];

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const displayName = session.user.name ?? session.user.email ?? "Account";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="text-2xl font-semibold text-amber-300">
              NutriTrack
            </Link>
            <p className="text-sm text-slate-400">Hi {displayName}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:gap-10">
        {children}
      </main>
    </div>
  );
}
