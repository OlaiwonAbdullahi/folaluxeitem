"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-heading text-6xl font-light italic text-zinc-300">
        Oops
      </p>
      <h1 className="mt-6 font-heading text-3xl font-medium text-zinc-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
        An unexpected error occurred while loading this page. You can try again,
        or head back to the homepage.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-zinc-400">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => unstable_retry()} className="rounded-xl">
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
