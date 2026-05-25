export const SkeletonLoader = ({ count = 8 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-[28px] border border-[#C8A96A]/15 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.08)]">
        <div className="h-72 animate-pulse bg-[#E9DDC7]" />
        <div className="space-y-4 p-6">
          <div className="h-3 w-24 animate-pulse rounded-full bg-[#E9DDC7]" />
          <div className="h-7 w-44 animate-pulse rounded-full bg-[#E9DDC7]" />
          <div className="h-10 animate-pulse rounded-full bg-[#E9DDC7]" />
        </div>
      </div>
    ))}
  </div>
);
