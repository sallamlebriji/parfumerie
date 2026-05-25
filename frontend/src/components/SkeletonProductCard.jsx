const SkeletonProductCard = () => (
  <div className="overflow-hidden rounded-[28px] border border-gold/10 bg-white shadow-luxury">
    <div className="h-[280px] animate-pulse bg-beige" />
    <div className="space-y-4 p-6">
      <div className="h-3 w-24 animate-pulse rounded-full bg-beige" />
      <div className="h-7 w-44 animate-pulse rounded-full bg-beige" />
      <div className="h-5 w-28 animate-pulse rounded-full bg-beige" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 animate-pulse rounded-full bg-beige" />
        <div className="h-10 animate-pulse rounded-full bg-beige" />
      </div>
    </div>
  </div>
);

export default SkeletonProductCard;
