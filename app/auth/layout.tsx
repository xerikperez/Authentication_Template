import { db } from "@/lib/db";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await db.user;
  return (
    
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
      {children}
    </div>
  );
}
