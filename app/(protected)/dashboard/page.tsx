import { auth } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();
  const userName = session?.user?.name ?? "there";

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          Here's a quick look at what's happening with your account today.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Active Sessions</h2>
          <p className="mt-2 text-2xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">
            Sessions currently connected across your devices.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Security Score</h2>
          <p className="mt-2 text-2xl font-bold">92%</p>
          <p className="text-sm text-muted-foreground">
            Great job! Review security settings to keep improving.
          </p>
        </article>
        <article className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Pending Tasks</h2>
          <p className="mt-2 text-2xl font-bold">2</p>
          <p className="text-sm text-muted-foreground">
            Complete profile verification and enable MFA backup codes.
          </p>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
