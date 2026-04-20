import Link from "next/link";
import { getSession } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="font-display text-xl text-ink-900">
              Lumen
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-ink-600">
              <Link href="/dashboard" className="hover:text-ink-900">
                Galleries
              </Link>
              <Link href="/dashboard/favorites" className="hover:text-ink-900">
                Favorites
              </Link>
              <Link href="/dashboard/selections" className="hover:text-ink-900">
                Selections
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-600">
            <span className="hidden sm:inline">{session?.user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
