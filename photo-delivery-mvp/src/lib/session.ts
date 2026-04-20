import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

export async function getSession(): Promise<Session | null> {
  return getServerSession();
}
