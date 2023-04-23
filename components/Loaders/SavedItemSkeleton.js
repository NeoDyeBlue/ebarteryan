import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SavedItemSkeleton() {
  return (
    <div className="flex gap-2 p-3">
      <div className="aspect-square w-full max-w-[120px] flex-shrink-0 overflow-hidden rounded-[10px] leading-none md:max-w-[150px]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="max-w-[320px] overflow-hidden rounded-[10px] font-display font-semibold leading-none">
          <Skeleton />
        </p>
        <p className="max-w-[120px] overflow-hidden rounded-[10px] font-medium leading-none">
          <Skeleton />
        </p>
        <p className="max-w-[320px] overflow-hidden rounded-[10px] leading-none">
          <Skeleton />
        </p>
      </div>
    </div>
  );
}
