import SkeletonBar from "@/components/atoms/SkeletonBar";
import TableHeader from "@/components/market/depth/TableHeader";

export default function DepthTableSkeleton() {
  return (
    <div className="w-full">
      <div className="">
        <TableHeader />
      </div>
      {/* Asks */}
      <div className="mb-3">
        {[...Array(10)].map((_, i) => (
          <SkeletonBar key={i} />
        ))}
      </div>

      {/* Bids */}
      <div>
        {[...Array(10)].map((_, i) => (
          <SkeletonBar key={i} />
        ))}
      </div>
    </div>
  );
}
