"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

type GalleryRow = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  photoCount: number;
};

export default function DashboardPage() {
  const [galleries, setGalleries] = useState<GalleryRow[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/galleries");
    if (!res.ok) {
      setError("Could not load galleries.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setGalleries(data.galleries);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim() }),
    });
    setCreating(false);
    if (!res.ok) {
      setError("Could not create gallery.");
      return;
    }
    setTitle("");
    await load();
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl text-ink-950">Galleries</h1>
        <p className="mt-2 max-w-xl text-ink-600">
          Create a gallery, upload images, then share the public link with your clients.
        </p>
      </div>

      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">New gallery</h2>
        <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm text-ink-800">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spring editorial"
              className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 outline-none transition focus:border-ink-400"
            />
          </label>
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">Your galleries</h2>
        {loading ? (
          <p className="mt-4 text-ink-500">Loading…</p>
        ) : galleries.length === 0 ? (
          <p className="mt-4 text-ink-600">No galleries yet. Create one above.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-white shadow-sm">
            {galleries.map((g) => (
              <li key={g.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-ink-900">{g.title}</p>
                  <p className="text-xs text-ink-500">
                    {g.photoCount} photo{g.photoCount === 1 ? "" : "s"} · slug{" "}
                    <code className="rounded bg-ink-100 px-1 py-0.5">{g.slug}</code>
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    Client link:{" "}
                    <Link
                      href={`/gallery/${g.slug}`}
                      className="text-ink-700 underline-offset-2 hover:underline"
                    >
                      {origin}/gallery/{g.slug}
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/gallery/${g.slug}`}
                    className="rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-800 transition hover:bg-ink-50"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/dashboard/galleries/${g.id}`}
                    className="rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-ink-800"
                  >
                    Upload & manage
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
