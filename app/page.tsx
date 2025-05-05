"use client";
import { Poppins } from "next/font/google";
import { Sansita } from "next/font/google";
import cx from "classix";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="h-full flex items-center justify-center  bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
      <div className="gap-y-6 flex flex-col items-center justify-center text-center">
        <h1
          className={cx(
            font.className,
            "text-6xl font-semibold text-white drop-shadow-md"
          )}
        >
          🔐Auth
        </h1>
        <p className="text-white text-lg">A simple auth service</p>
        <LoginButton>
          <button className="rounded-md bg-white hover:bg-amber-100 w-40 h-15 text-2xl">
            Sign In
          </button>
        </LoginButton>
      </div>
    </main>
  );
}
