import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found — FolaLuxe",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-heading text-7xl font-light italic text-zinc-300 sm:text-8xl">
          404
        </p>
        <h1 className="mt-6 font-heading text-3xl font-medium text-zinc-900 sm:text-4xl">
          This page has wandered off
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to something beautiful.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-xl">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
