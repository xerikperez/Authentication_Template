"use client";
import { Poppins } from "next/font/google";
import cx from "classix";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full min-h-screen items-center justify-center bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 text-center">
      <div className="flex max-w-xl flex-col items-center gap-y-6 text-white drop-shadow-lg">
        <h1
          className={cx(font.className, "text-6xl font-semibold text-white drop-shadow-md")}
        >
          NutriTrack
        </h1>
        <p className="text-lg">
          Log meals in seconds, visualize your calories and macros, and keep your streak going strong.
        </p>
        <LoginButton>
          <button className="h-12 w-44 rounded-md bg-white text-xl font-semibold text-amber-600 transition hover:bg-amber-100">
            Sign in
          </button>
        </LoginButton>
      </div>
    </main>
  );
}
