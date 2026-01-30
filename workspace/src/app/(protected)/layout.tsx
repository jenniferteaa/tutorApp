import { redirect } from "next/navigation";

import { AuthProvider } from "@/components/AuthProvider";
import { clearAuthUser, getAuthSession } from "@/lib/auth";

async function logoutAction() {
  "use server";
  await clearAuthUser();
  redirect("/login");
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <AuthProvider userId={session.userId}>
      <div className="relative min-h-screen">
        <form action={logoutAction} className="fixed right-6 top-6 z-50">
          <button
            type="submit"
            className="rounded-full border border-black/20 bg-white/80 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-white"
          >
            Logout
          </button>
        </form>
        {children}
      </div>
    </AuthProvider>
  );
}
