import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OfferCardSkeleton() {
  return (
    <div className="min-h-[280px] overflow-hidden rounded-[10px] leading-none">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
