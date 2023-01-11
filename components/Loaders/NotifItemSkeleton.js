import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NotifItemSkeleton() {
  return (
    <li className="mb-2 flex items-center gap-2 px-2">
      <Skeleton
        width={48}
        height={48}
        circle
        className="h-[48px] w-[48px] flex-shrink-0 overflow-hidden"
      />
      <div className="w-full">
        <Skeleton count={2} className="overflow-hidden rounded-[10px]" />
      </div>
    </li>
  );
}
