import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[var(--border)]">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="px-4 py-3.5 flex flex-col gap-0.5">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-3/4 mt-1" />
        <Skeleton className="h-4 w-20 mt-1" />
        <div className="flex gap-1.5 mt-2">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}
