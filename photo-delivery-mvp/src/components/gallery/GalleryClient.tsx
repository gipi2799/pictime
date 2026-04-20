"use client";

import { useEffect, useState } from "react";

export function GalleryClient({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gallery loading logic will be implemented here
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  return <div className="gallery-container">Gallery: {slug}</div>;
}
