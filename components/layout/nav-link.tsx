"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
}

export const NavLink = ({ href, label }: NavLinkProps) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-amber-400/20 text-amber-300"
          : "text-slate-300 hover:text-white hover:bg-amber-400/10"
      )}
    >
      {label}
    </Link>
  );
};
