export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500">
      {children}
    </div>
  );
}
