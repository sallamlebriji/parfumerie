import { Star } from "lucide-react";

export const RatingStars = ({ value = 5 }) => (
  <div className="flex items-center gap-1 text-[#C8A96A]">
    {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill={index + 1 <= Math.round(value) ? "currentColor" : "none"} />)}
    <span className="ml-2 text-xs font-bold text-[#8A8A8A]">{value}</span>
  </div>
);
