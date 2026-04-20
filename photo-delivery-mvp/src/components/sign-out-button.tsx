"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
      className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
    >
      Sign Out
    </button>
  );
}
