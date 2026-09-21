export const SkeletonLoader = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" aria-busy="true" aria-label="Chargement">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index}>
        <div className="aspect-[4/5] animate-pulse rounded-2xl bg-brand-sand/70" />
        <div className="mt-4 h-3 w-20 animate-pulse rounded-full bg-brand-sand/70" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded-full bg-brand-sand/70" />
        <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-brand-sand/70" />
      </div>
    ))}
  </div>
);
