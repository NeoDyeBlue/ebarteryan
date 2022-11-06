import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ItemCardSkeleton() {
  return (
    <div className="flex max-h-[400px] flex-col gap-4">
      <div className="aspect-square min-h-[150px] overflow-hidden rounded-[10px] leading-none">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="overflow-hidden rounded-[10px] font-display font-semibold leading-none">
          <Skeleton />
        </p>
        <p className="max-w-[120px] overflow-hidden rounded-[10px] font-medium leading-none">
          <Skeleton />
        </p>
        <p className="overflow-hidden rounded-[10px] leading-none">
          <Skeleton />
        </p>
      </div>
    </div>
  );
}
