import { Skeleton } from "@/components/ui/skeleton"
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
  DeliveryTruck01Icon,
  CreditCardIcon,
  ReloadIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import ProductCardSkeleton from "@/app/_components/ProductCardSkeleton";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

export default function ProductDetailSkeleton() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 min-h-screen px-6 md:px-0">
        <div className="pt-24 pb-4 section-padding max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>

        <section className="section-padding max-w-7xl mx-auto w-full pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <Skeleton className="aspect-3/4 rounded-3xl" />

            <div className="flex flex-col gap-6">
              <div>
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>

              <Skeleton className="h-20 w-full" />
              
              <Skeleton className="h-px w-full" />

              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20 rounded-full" />
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-40 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-11 w-12 rounded-xl" />
                  <Skeleton className="h-11 w-12 rounded-xl" />
                  <Skeleton className="h-11 w-12 rounded-xl" />
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Skeleton className="h-12 w-32 rounded-full" />
                <Skeleton className="h-12 flex-1 rounded-full" />
              </div>

              <Skeleton className="h-12 w-full rounded-full" />

              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="section-padding py-20 bg-(--brand-blush)/40 w-full px-6 md:px-0">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
